import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadTrainingAudio,
  listTrainingAudio,
} from "../controllers/audio.controller.js";

const audioRouter = express.Router();

// Grouping routes by path
audioRouter
  .route("/upload-audio")
  .post(upload.single("audio"), uploadTrainingAudio);

audioRouter.route("/list-audio").get(listTrainingAudio);

export default audioRouter;
