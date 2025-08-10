import cloudinary, { uploadOnCloudinary } from "../utils/cloudinary.js";

const PROJECT_FOLDER = "voice-web-app/training-audio";

export const uploadTrainingAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary and get the URL
    const audioUrl = await uploadOnCloudinary(req.file.path, PROJECT_FOLDER);

    res.json({
      message: "File uploaded successfully",
      success: true,
      url: audioUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const listTrainingAudio = async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression(`folder:${PROJECT_FOLDER}`)
      .sort_by("public_id", "desc")
      .max_results(50)
      .execute();

    res.json({
      success: true,
      files: result.resources.map((f) => f.secure_url),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
