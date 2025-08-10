import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    // Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!localFilePath) return null;
    console.log("Uploading to cloudinary: ");

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "video", // required for audio
      folder: folderName,
      use_filename: true,
    });
    console.log("Successfully uploaded to Cloudinary");

    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw error;
  }
};
export default cloudinary;
