import mongoose from "mongoose";

/* Connect with bounded retries and linear backoff. The URI itself is
   never logged (it may embed credentials). On final failure the
   process exits non-zero so `restart: unless-stopped` + the
   `service_healthy` dependency cycle the backend until MongoDB is
   reachable — the API never serves traffic against a dead database. */
const connectDB = async (retries = 5) => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB Connected");
      return;
    } catch {
      console.error(
        `MongoDB connection attempt ${attempt}/${retries} failed`
      );
      if (attempt === retries) {
        console.error("MongoDB Connection Error");
        process.exit(1);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * attempt)
      );
    }
  }
};

export default connectDB;