# SystemaOps Internal Database — Architecture & Operations

## 1. Architecture

```text
                    INTERNET
                       │
                       ▼
               ┌──────────────┐
               │    proxy     │  nginx, publishes 80:80 (ONLY public port)
               │  (nginx:80)  │
               └──────┬───────┘
                      │  /api/* ──▶ backend:5000
                      │  /* ──────▶ frontend:3000
                      ▼
               ┌──────────────┐      ┌──────────────┐
               │   backend    │─────▶│   mongodb    │  mongo:7, NO published
               │ Node/Express │      │  (internal)  │  ports — Docker network only
               └──────────────┘      └──────┬───────┘
                                            ▼
                                     ┌──────────────┐
                                     │ mongodb_data │  named Docker volume
                                     │   (persistent)│  (survives restarts)
                                     └──────────────┘
```

- **Database choice: MongoDB (Mongoose).** It was already the
  established backend database (models, TTL retention, backfill
  tooling) — no new technology was introduced.
- **Internal only.** The backend connects via Docker DNS as
  `mongodb://mongodb:27017/systemaops`. There is no Atlas / Firebase /
  Supabase / Neon / Railway / Render / cloud dependency anywhere.
- **Persistence.** Named volume `mongodb_data` → `/data/db`.
  `docker compose down` and `docker compose restart` keep the data.
- **Startup order.** `backend` starts only after `mongodb` is
  `service_healthy` (mongosh ping); the backend additionally retries
  the Mongoose connection 5× with backoff. `proxy` waits for backend
  + frontend healthy.

## 2. Collections & indexes

| Data | Collection | Model | TTL index |
|---|---|---|---|
| Contact enquiries | `contacts` | `src/models/Contact.js` | `expiresAt_1`, `expireAfterSeconds: 0` |
| Job applications | `careerapplications` | `src/models/CareerApplication.js` | same |

- **Retention:** `expiresAt = createdAt + 1 calendar year`
  (`src/utils/retention.js`, single source of truth). MongoDB's TTL
  monitor deletes expired docs automatically (typically within ~60s
  of expiry — eventual, never exact-time).
- **Privacy fields** on every record: `privacyAccepted`,
  `privacyVersion`, `privacyAcceptedAt`, `createdAt`, `expiresAt`.
  Submissions without `privacyAccepted: true` are rejected (400).
- **Bootstrap:** `mongo-init/01-schema.js` (mounted read-only)
  creates collections, validators, and TTL indexes on FIRST init of
  an empty volume. Later starts skip it; the backfill script and
  Mongoose auto-indexing keep indexes healthy afterwards.
- **Backfill (never deletes, never drops):**
  `npm run migrate:retention` (missing only) ·
  `-- --dry-run` (report, no writes) ·
  `-- --repair` (also fix invalid values).

## 3. Environment variables

| File | Key | Meaning |
|---|---|---|
| root `.env` | `MONGO_URI` | Backend connection string. Default `mongodb://mongodb:27017/systemaops`. With auth: `mongodb://user:pass@mongodb:27017/systemaops?authSource=systemaops` |
| root `.env` | `MONGO_DATABASE` | DB name on first init (default `systemaops`) |
| root `.env` | `MONGO_ROOT_USERNAME` / `MONGO_ROOT_PASSWORD` | Optional root user — **first init of an empty volume only** |
| root `.env` | `RESEND_API_KEY`, `SENDER_EMAIL`, `FOUNDER_EMAIL` | Transactional email (Resend). REQUIRED for password-reset delivery (valid key + verified sender domain); optional for form-lead emails (forms work without) |
| root `.env` | `ADMIN_APP_ORIGIN`, `RESET_TOKEN_TTL_MINUTES` | Password-reset link origin (default `http://localhost`) and token lifetime in minutes (default 30) |
| Server `.env` | `MONGO_URI`, `PORT`, `CORS_ORIGINS`, `TRUST_PROXY`, mail vars | Local/dev backend config (see `Server/.env.example`) |

Templates with placeholders only: root `.env.example`,
`Server/.env.example`. Both `.env` files are gitignored (root +
`Server/.gitignore`).

## 4. Daily operations (run from the repo root)

```sh
docker compose config        # validate YAML + interpolation (no daemon needed)
docker compose up -d         # start the full stack
docker compose ps            # container + health status
docker compose logs -f backend
docker compose logs -f mongodb
docker compose restart backend
docker compose down          # stop stack, KEEP data volume
```

### Host-side backend dev (`npm run dev` in `Server/`)

1. Start Docker Desktop, then start just the database:
   `docker compose up -d mongodb`
2. `Server/.env` must contain
   `MONGO_URI=mongodb://127.0.0.1:27017/systemaops` (present by
   default). Reachability comes from `docker-compose.override.yml`,
   which binds MongoDB to **127.0.0.1 only** — your machine alone,
   never the LAN/internet.
3. `npm run dev` in `Server/`. Production deploys exclude the
   override (`docker compose -f docker-compose.yml up -d`), so the
   base file's no-published-ports posture is what ships.

⚠️ **NEVER run `docker compose down -v` casually** — `-v` deletes
the `mongodb_data` volume and all production records with it.

## 5. Verification checklist

```sh
# 1. Health (via public proxy path)
curl http://localhost/api/health
# → {"ok":true,"status":"ok","database":"connected"}

# 2. Submit a test enquiry
curl -X POST http://localhost/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"QA Test","email":"qa@example.com","phone":"+491234567890","company":"QA","message":"retention test","privacyAccepted":true}'
# → 201 {"success":true,...}

# 3. Confirm the record inside MongoDB
docker compose exec mongodb mongosh --quiet --eval \
  'db.getSiblingDB("systemaops").contacts.findOne({email:"qa@example.com"},{expiresAt:1,privacyAccepted:1})'

# 4. Confirm TTL indexes
docker compose exec mongodb mongosh --quiet --eval \
  'db.getSiblingDB("systemaops").contacts.getIndexes()'
# → expiresAt_1 with expireAfterSeconds: 0 (same for careerapplications)

# 5. Persistence: restart and re-check
docker compose restart
docker compose exec mongodb mongosh --quiet --eval \
  'db.getSiblingDB("systemaops").contacts.countDocuments({email:"qa@example.com"})'
# → 1

# 6. No public exposure: mongodb publishes NO ports
docker compose ps   # mongodb must show no 0.0.0.0:27017 mapping
```

Career endpoint: `POST /api/careers/apply` (resume is a URL string in
JSON — no file upload). Same 201/400/500 contract.

## 6. Backup & restore (internal, container-native)

```sh
# Backup (timestamped archive on the HOST via container stdout)
docker compose exec -T mongodb mongodump \
  --db systemaops --archive | gzip > systemaops-$(date +%F).archive.gz

# Restore (stops writes first, then replays)
docker compose stop backend
gunzip -c systemaops-YYYY-MM-DD.archive.gz | \
  docker compose exec -T mongodb mongorestore --archive --drop
docker compose start backend

# Verify: re-run the countDocuments + getIndexes checks from §5.
```

Store archives off-container (host path, encrypted at rest per your
infra policy). No cloud backup service is configured — internal
hosting only, by founder requirement.

## 7. Enabling authentication later (optional hardening)

1. On a FRESH volume: set `MONGO_ROOT_USERNAME` /
   `MONGO_ROOT_PASSWORD` in root `.env`, set `MONGO_URI` with those
   credentials, then `docker compose up -d`.
2. On an EXISTING volume (has data, no users): create the user live
   instead — never wipe the volume:
   ```sh
   docker compose exec mongodb mongosh --eval \
     'db.getSiblingDB("admin").createUser({user:"sysops_admin",pwd:"...",roles:[{role:"root",db:"admin"}]})'
   ```
   then set `MONGO_URI` accordingly and `docker compose up -d backend`.
3. Prefer a least-privilege app user (`readWrite` on `systemaops`)
   over daily root use for the backend connection.

## 8. Security posture

- MongoDB: no published ports; reachable only via compose DNS.
- Credentials: env-only, never committed (gitignored), never logged
  (connection errors log generic messages; `/health` exposes no URI).
- API: helmet, CORS allowlist, 100kb body limit, MongoDB operator
  sanitizer (Express 5-safe), 30 req/15min rate limit on form routes,
  per-field validation + sanitization + email/phone checks, privacy
  consent enforced, safe generic 500s in production.
- Shutdown: SIGTERM/SIGINT close HTTP + Mongoose cleanly.
- Email (Resend) is notification-only: failures never fail a
  submission and never leak details.
