import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadOnCloudinary = async (
  localFilePath,
  folderName,
  userName
) => {
  try {
    // Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!localFilePath) return null;

    console.log("Uploading to cloudinary:", localFilePath);

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "video", // Required for audio files
      folder: folderName,
      use_filename: true,
      unique_filename: true, // Ensure unique filenames
      context: {
        owner: userName,
        uploaded_at: new Date().toISOString(),
      },
      // Add tags for better organization
      tags: [`voice-training`, `user-${userName}`],
    });

    console.log("Successfully uploaded to Cloudinary:", result.public_id);

    // Clean up local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file cleaned up:", localFilePath);
    }

    // Return the complete result object, not just the URL
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    // Clean up local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file cleaned up after error:", localFilePath);
    }

    throw error;
  }
};

export default cloudinary;
