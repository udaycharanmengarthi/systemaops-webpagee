/* Server/src/scripts/create-admin.js
 *
 * Creates the FIRST (or an additional) admin user. Run on the host:
 *
 *   npm run admin:create -- --email you@company.com --name "Your Name" [--role SUPER_ADMIN]
 *
 * Resets the password of an EXISTING admin user (no duplicate created):
 *
 *   npm run admin:reset -- --email you@company.com
 *
 * The password is read from ADMIN_PASSWORD env (preferred — never in
 * shell history via --password) or prompted interactively... via
 * --password flag as a fallback. Create mode refuses to overwrite an
 * existing account. Reset mode bumps tokenVersion (revoking all existing
 * sessions) and clears any lockout. Never logs the password.
 */

import dotenv from "dotenv";
dotenv.config();

import readline from "node:readline";
import bcrypt from "bcryptjs";
import validator from "validator";
import mongoose from "mongoose";
import AdminUser from "../models/AdminUser.js";
import { isValidRole } from "../config/workflow.js";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : null;
}

function promptPassword() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Admin password (min 12 chars): ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const reset = process.argv.includes("--reset");
  const email = (arg("email") || "").trim().toLowerCase();
  const name = (arg("name") || "").trim();
  const role = (arg("role") || "SUPER_ADMIN").trim().toUpperCase();
  let password = process.env.ADMIN_PASSWORD || arg("password") || "";

  if (!email || !validator.isEmail(email)) {
    console.error("Provide --email with a valid email address.");
    process.exit(1);
  }
  if (!reset && !name) {
    console.error("Provide --name.");
    process.exit(1);
  }
  if (!isValidRole(role)) {
    console.error("Provide --role SUPER_ADMIN|ADMIN|MANAGER|VIEWER.");
    process.exit(1);
  }
  if (!password) password = await promptPassword();
  if (password.length < 12 || password.length > 128) {
    console.error("Password must be 12-128 characters.");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const existing = await AdminUser.findOne({ email }).select("_id");
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    if (!reset) {
      console.error(`An admin with ${email} already exists. Refusing to overwrite.`);
      await mongoose.disconnect();
      process.exit(1);
    }
    await AdminUser.updateOne(
      { _id: existing._id },
      {
        $set: { passwordHash, failedAttempts: 0, lockedUntil: null },
        $inc: { tokenVersion: 1 },
      }
    );
    console.log(
      `Password reset for admin: ${email} (existing sessions revoked, lockout cleared).`
    );
    await mongoose.disconnect();
    return;
  }

  if (reset) {
    console.error(`No admin with ${email} exists. Omit --reset to create it.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const user = await AdminUser.create({
    email,
    name: name.slice(0, 120),
    role,
    passwordHash,
  });
  console.log(`Created ${user.role} admin: ${user.email} (${user._id})`);
  await mongoose.disconnect();
}

main().catch(() => {
  console.error("Admin creation failed.");
  process.exit(1);
});
