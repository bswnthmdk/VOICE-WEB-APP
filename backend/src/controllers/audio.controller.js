import cloudinary, { uploadOnCloudinary } from "../utils/cloudinary.js";

const PROJECT_FOLDER = "voice-web-app/training-audio";

export const uploadTrainingAudio = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file type
    const allowedMimeTypes = [
      "audio/webm",
      "audio/wav",
      "audio/mp3",
      "audio/mpeg",
      "audio/ogg",
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedMimeTypes.join(
          ", "
        )}`,
      });
    }

    // Get owner name from request body
    const { ownerName } = req.body;
    if (!ownerName) {
      return res.status(400).json({
        success: false,
        message: "Owner name is required",
      });
    }

    console.log("🎵 Uploading audio file:", {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      owner: ownerName,
    });

    // Upload to Cloudinary (returns full result object now)
    const uploadResult = await uploadOnCloudinary(
      req.file.path,
      PROJECT_FOLDER,
      ownerName
    );

    if (!uploadResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload file to Cloudinary",
      });
    }

    console.log("✅ Upload successful:", uploadResult.public_id);

    // Return success response with proper data
    res.json({
      success: true,
      message: "File uploaded successfully",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      owner: ownerName,
      uploadedAt: uploadResult.created_at,
      format: uploadResult.format,
      duration: uploadResult.duration, // Available for audio files
    });
  } catch (error) {
    console.error("❌ Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error during upload",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const listTrainingAudio = async (req, res) => {
  try {
    console.log("📋 Fetching training audio files from:", PROJECT_FOLDER);

    const result = await cloudinary.search
      .expression(`folder:${PROJECT_FOLDER}`)
      .sort_by("created_at", "desc") // Sort by creation date instead of public_id
      .max_results(50)
      .with_field("context") // Include context metadata
      .with_field("tags") // Include tags
      .execute();

    console.log(`📊 Found ${result.resources.length} audio files`);

    // Enhanced response with more metadata
    const files = result.resources.map((file) => ({
      url: file.secure_url,
      publicId: file.public_id,
      createdAt: file.created_at,
      format: file.format,
      duration: file.duration,
      size: file.bytes,
      owner: file.context?.owner || "unknown",
      tags: file.tags || [],
    }));

    res.json({
      success: true,
      count: files.length,
      files: files,
    });
  } catch (error) {
    console.error("❌ List audio error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve audio files",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint to delete training audio (optional)
// export const deleteTrainingAudio = async (req, res) => {
//   try {
//     const { publicId } = req.params;

//     if (!publicId) {
//       return res.status(400).json({
//         success: false,
//         message: "Public ID is required",
//       });
//     }

//     console.log("🗑️ Deleting audio file:", publicId);

//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: "video", // Required for audio files
//     });

//     if (result.result === "ok") {
//       console.log("✅ Audio file deleted successfully");
//       res.json({
//         success: true,
//         message: "Audio file deleted successfully",
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Failed to delete audio file",
//       });
//     }
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error during deletion",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };
