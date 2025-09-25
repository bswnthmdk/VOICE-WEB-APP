import { v2 as cloudinary } from "cloudinary";

export const uploadOnCloudinary = async (
  fileBuffer,
  folderName,
  userName,
  originalName
) => {
  try {
    // Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!fileBuffer) return null;

    console.log("Uploading to cloudinary from memory buffer");

    // Upload from buffer instead of file path
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video", // Required for audio files
            folder: folderName,
            public_id: `${userName}_${Date.now()}_${
              originalName.split(".")[0]
            }`,
            context: {
              owner: userName,
              uploaded_at: new Date().toISOString(),
            },
            tags: [`voice-training`, `user-${userName}`],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(fileBuffer);
    });

    console.log("Successfully uploaded to Cloudinary:", result.public_id);
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};
export default cloudinary;
