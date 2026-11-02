import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { describePaymentsConfig } from "./src/config/payments.js";

const requiredInProduction = ["MONGO_URI"];
if (process.env.NODE_ENV === "production") {
  const missing = requiredInProduction.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

await connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  /* Startup-safe payment status: mode, required-key presence only. The
     configured Price is validated against Stripe on offer/checkout, not at
     startup, so an unavailable Stripe API cannot prevent the site booting.
     Never prints a secret key, webhook secret or Price ID. */
  const payments = describePaymentsConfig();
  console.log(`Payments configuration: ${JSON.stringify(payments)}`);

  if (!payments.configured) {
    console.warn(
      `Payments are disabled until configured. Missing or invalid: ${payments.missing.join(", ")}`
    );
  }
});

/* Graceful shutdown: stop accepting traffic, then close the MongoDB
   connection cleanly. A forced exit after 10s guards against hangs. */
const shutdown = (signal) => {
  console.log(`Received ${signal}, shutting down`);
  server.close(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // Disconnect failures must not block shutdown.
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
