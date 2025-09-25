// backend/src/routes/audio.route.js - UPDATED VERSION

import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
  uploadTrainingAudio,
  listTrainingAudio,
  deleteTrainingAudio,
} from "../controllers/audio.controller.js";

const audioRouter = express.Router();

// Protected audio routes - require authentication
audioRouter
  .route("/upload-audio")
  .post(verifyAccessToken, upload.single("audio"), uploadTrainingAudio);

audioRouter.route("/list-audio").get(verifyAccessToken, listTrainingAudio);

// New delete endpoint (optional)
audioRouter
  .route("/delete-audio/:publicId")
  .delete(verifyAccessToken, deleteTrainingAudio);

export default audioRouter;
