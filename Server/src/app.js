// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { mongoSanitizeBody } from "./middleware/mongoSanitize.js";

import contactRoutes from "./routes/contact.routes.js";
import careerRoutes  from "./routes/career.routes.js";

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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    maxAge: 600,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
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
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/contact", formLimiter, contactRoutes);
app.use("/api/careers", formLimiter, careerRoutes);

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