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

    const { ownerName } = req.body; // 👈 get owner name from request
    if (!ownerName) {
      return res
        .status(400)
        .json({ success: false, message: "Owner name is required" });
    }

    // Upload with owner metadata
    const result = await uploadOnCloudinary(
      req.file.path,
      PROJECT_FOLDER,
      ownerName
    );

    res.json({
      message: "File uploaded successfully",
      success: true,
      url: result.secure_url,
      owner: ownerName,
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
