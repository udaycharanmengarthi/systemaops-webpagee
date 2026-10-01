import mongoose from "mongoose";

function oneYearFromNow() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },

    company: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    privacyAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    privacyVersion: {
      type: String,
      default: "2026-01-01",
      trim: true,
      maxlength: 32,
    },

    privacyAcceptedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
      default: oneYearFromNow,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contact", contactSchema);