import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";

const app = express();

console.log("Starting VoiceAuth Backend Server...");
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("CORS Origin:", process.env.CORS_ORIGIN || "Not set");

// CORS Configuration - UNCOMMENTED FOR PRODUCTION
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log(`Headers:`, {
    authorization: req.headers.authorization ? "Bearer ***" : "None",
    "content-type": req.headers["content-type"],
    origin: req.headers.origin,
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const API_BASE = "/voice-web-app/api";
console.log("API Base Path:", API_BASE);

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.status(200).json({
    status: "OK",
    message: "VoiceAuth server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Register routes
app.use(`${API_BASE}/users`, userRoutes);
console.log("User routes registered at:", `${API_BASE}/users`);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
    timestamp: new Date().toISOString(),
  });
});

// Handle 404
app.use("*", (req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

console.log("Backend configuration complete");

export default app;
