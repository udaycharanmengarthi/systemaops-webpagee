# SystemaOps Data Retention & Deployment Notes

## 1. Canonical MongoDB collections

| Data | Collection | Mongoose model |
|---|---|---|
| Contact enquiries | `contacts` | `Contact` (`src/models/Contact.js`) |
| Job applications | `careerapplications` | `CareerApplication` (`src/models/CareerApplication.js`) |

The names are pinned explicitly via the schemas' `collection` option.
Do NOT rename them without a data migration — production records and
the TTL indexes below live in these collections.

## 2. One-year retention policy

Contact enquiries and job applications are kept for **one calendar
year from submission**, then removed automatically. This matches the
privacy policy wording ("kept for 12 months … then automatically
deleted").

Implementation (`src/utils/retention.js`, single source of truth):
`expiresAt = createdAt + 1 calendar year` via `Date#setFullYear`
(not a fixed 365 days). Creation endpoints capture one instant and
store it as both `createdAt` and the basis for `expiresAt`; the
schema default and a `pre("validate")` backstop cover any other
creation path. Leap-day submissions roll over per JavaScript Date
semantics (Mar 1, occasionally Feb 28 depending on server timezone)
and are always >= 365 days out — a record can never expire early
because of this edge.

## 3. TTL behavior

Both collections carry:

- index `expiresAt_1` on `{ expiresAt: 1 }`
- `expireAfterSeconds: 0` (expire exactly at `expiresAt`)

Mongoose creates these automatically at startup; the backfill script
also ensures them idempotently. MongoDB's TTL monitor wakes roughly
every 60 seconds, so deletion typically lags expiry by under a
minute (longer on loaded or shared-tier clusters). **Deletion is
eventual, never exact-time.** Never drop or alter the `expiresAt_1`
index without a reviewed migration — see the backfill's conflict
handling below.

## 4. Backfill / migration

```sh
npm run migrate:retention              # fill MISSING expiresAt only (safe default)
npm run migrate:retention -- --dry-run # report counts, perform NO writes
npm run migrate:retention -- --repair  # also repair invalid expiresAt values
```

Repair fixes: missing values, wrong types, `expiresAt <= createdAt`,
and `expiresAt` more than 367 days after `createdAt` (the ceiling
allows the legitimate Feb 29 → Mar 1 leap edge). It never deletes
records, never touches valid values outside repair mode, and prints
counts. If a conflicting `expiresAt` index is detected, the script
refuses to overwrite it and prints manual resolution steps.

## 5. Environment variables (names only)

See `Server/.env.example` (backend) and the root `.env.example`
(compose). Required in production: `MONGO_URI` — default
`mongodb://mongodb:27017/systemaops` (internal Docker DNS; never an
external host).
Optional: `PORT` (default 5000), `CORS_ORIGINS`, `TRUST_PROXY`,
`MONGO_DATABASE`, `MONGO_ROOT_USERNAME`/`MONGO_ROOT_PASSWORD`
(auth, first-init only), `RESEND_API_KEY`, `SENDER_EMAIL`,
`FOUNDER_EMAIL` (without the mail vars, submissions still succeed;
founder emails are skipped).

Set `TRUST_PROXY=1` only when running behind the production reverse
proxy (docker-compose sets it); leave unset for direct deployments.

## 6. Docker architecture (internal database)

Single public entrypoint (`docker-compose.yml` at the repo root):

```text
Browser -> proxy:80 -+-> /api/* -> backend:5000
                     +-> /*      -> frontend:3000 (SPA)

backend:5000 -> mongodb:27017 (internal Docker network only)
mongodb_data volume -> persistent storage
```

- `proxy/` (nginx) routes API traffic to the backend and everything
  else to the frontend. The frontend needs no backend URL config.
- MongoDB is **internal only**: the compose `mongodb` service
  (`mongo:7`) on the default Docker network with NO published ports —
  unreachable from the host/internet. The backend reaches it as
  `mongodb://mongodb:27017/systemaops`. NEVER point `MONGO_URI` at
  Atlas or any external managed database.
- Data persists in the named volume `mongodb_data` (survives
  `docker compose down` / `restart`). NEVER run
  `docker compose down -v` casually — it deletes the volume.
- `mongo-init/01-schema.js` bootstraps TTL indexes + validators on
  first init of an empty volume (mounted read-only in compose).
- Startup order: `backend` waits for `mongodb` `service_healthy`
  (mongosh ping); `proxy` waits for backend + frontend healthy.
- All services have `restart: unless-stopped`; mongodb, backend,
  frontend, and proxy all have healthchecks.
- Local development is unchanged: the Vite dev server still proxies
  `/api` to `http://localhost:5000`.
- Full operations guide (env vars, backup/restore, auth, retention):
  `Server/docs/DATABASE.md`.

## 7. API

- `GET /health` → `{ ok: true, status: "ok", database: "connected" }`
  (`database` is `"disconnected"` when Mongoose has no live
  connection; the endpoint itself always returns 200 while the
  process is alive)
- `POST /api/contact/` → contact enquiry (privacy consent required)
- `POST /api/careers/apply` → job application (privacy consent required)

Input is sanitized against MongoDB operator injection by an
Express 5-compatible middleware (`src/middleware/mongoSanitize.js`);
`express-mongo-sanitize@2.2.0` is incompatible with Express 5 (its
`req.query` reassignment throws on every request) and is no longer
used. Rate limiting: 30 requests / 15 min per IP on the form routes.

## 8. Compliance wording

No certification is claimed. Where relevant, use accurate wording
such as "GDPR-aligned processes" — never "GDPR certified" or
"HIPAA certified" — unless an actual certification exists.
