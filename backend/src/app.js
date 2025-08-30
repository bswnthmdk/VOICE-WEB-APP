import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import audioRoutes from "./routes/audio.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const API_BASE = "/voice-web-app/api";

// Register routes
app.use(`${API_BASE}/users`, userRoutes);
// app.use(`${API_BASE}/audio`, audioRoutes);

export default app;
