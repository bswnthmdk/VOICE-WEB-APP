import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadTrainingAudio,
  listTrainingAudio,
} from "../controllers/audio.controller.js";

const router = express.Router();

// Grouping routes by path
router.route("/upload-audio").post(upload.single("audio"), uploadTrainingAudio);

router.route("/list-audio").get(listTrainingAudio);

export default router;
