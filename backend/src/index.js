import dotenv from "dotenv";
console.log("Loading environment variables...");
dotenv.config();

console.log("Environment Check:");
console.log("   NODE_ENV:", process.env.NODE_ENV || "Not set");
console.log("   PORT:", process.env.PORT || "Not set (will use 8000)");
console.log("   MONGODB_URL:", process.env.MONGODB_URL ? "Set" : "Not set");
console.log("   CORS_ORIGIN:", process.env.CORS_ORIGIN || "Not set");
console.log(
  "   ACCESS_TOKEN_SECRET:",
  process.env.ACCESS_TOKEN_SECRET ? "Set" : "Not set"
);
console.log(
  "   REFRESH_TOKEN_SECRET:",
  process.env.REFRESH_TOKEN_SECRET ? "Set" : "Not set"
);

import app from "./app.js";
import { connectDB } from "./db/index.js";

console.log("Starting VoiceAuth Backend...");
connectDB(app);
