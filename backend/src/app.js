import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import audioRoutes from "./routes/audio.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use((req, res, next) => {
  console.log("Request Origin 1:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const API_BASE = "/voice-web-app/api";

// Register routes
app.use(`${API_BASE}/users`, userRoutes);
// app.use(`${API_BASE}/audio`, audioRoutes);

export default app;
