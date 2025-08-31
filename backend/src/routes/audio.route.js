import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import {
  uploadTrainingAudio,
  listTrainingAudio,
} from "../controllers/audio.controller.js";

const audioRouter = express.Router();

// Protected audio routes - require authentication
audioRouter
  .route("/upload-audio")
  .post(verifyAccessToken, upload.single("audio"), uploadTrainingAudio);

audioRouter.route("/list-audio").get(verifyAccessToken, listTrainingAudio);

export default audioRouter;
