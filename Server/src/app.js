// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { mongoSanitizeBody } from "./middleware/mongoSanitize.js";

import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contact.routes.js";
import careerRoutes  from "./routes/career.routes.js";
import adminRoutes   from "./routes/admin.routes.js";

const app = express();

/* Behind the production reverse proxy all client connections arrive
   from one hop away; trust exactly that hop so rate limiting and
   logging see real client IPs. Leave unset for direct deployments,
   where trusting X-Forwarded-For would allow IP spoofing. */
if (process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

/* CORS policy:
   1. No Origin header (curl, same-origin GETs, health checks) → allow.
   2. Explicit allowlist (cross-origin dev servers, e.g. Vite :5173/:5174) → allow.
   3. Same-origin through the reverse proxy → allow. The public site
      (/), the admin console (/admin/) and the API share the same Host
      (:80), so the browser sends `Origin: http://<host>` on JSON POSTs
      even for same-origin requests — that must never be rejected, and
      comparing hosts keeps this working on any production domain
      without env configuration.
   4. Anything else → 403 (never a wildcard; credentials stay explicit). */
app.use((req, res, next) => {
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      try {
        if (new URL(origin).host === req.headers.host) {
          return callback(null, true);
        }
      } catch {
        /* malformed origin → reject below */
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type"],
    maxAge: 600,
  })(req, res, next);
});

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());
/* Express 5-safe MongoDB operator sanitizer (body + params).
   See src/middleware/mongoSanitize.js for the rationale. */
app.use(mongoSanitizeBody);

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
});

  app.get("/", (req, res) => res.send("API Running..."));

  /* Liveness + DB status. Always 200 while the process is alive so the
     compose healthcheck stays green; `database` reports the Mongoose
     connection state ("connected" | "disconnected"). No credentials,
     URIs, or paths are ever exposed here. */
  app.get("/health", (req, res) =>
    res.json({
      ok: true,
      status: "ok",
      database:
        mongoose.connection.readyState === 1
          ? "connected"
          : "disconnected",
    })
  );

app.use("/api/contact", formLimiter, contactRoutes);
app.use("/api/careers", formLimiter, careerRoutes);

/* Admin operations platform (cookie-session auth enforced per route).
   Generous limit: dashboard polling + kanban drags are chatty by design. */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many requests, please try again later" },
  },
});
app.use("/api/admin", adminLimiter, adminRoutes);

// Central error handler: never leak stack traces in production.
app.use((err, req, res, next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const status = err && err.status ? err.status : 500;
  if (process.env.NODE_ENV !== "production") {
    return res.status(status).json({ success: false, message: err.message || "Server error" });
  }
  return res.status(status >= 500 ? 500 : status).json({ success: false, message: "Server error" });
});

export default app;