import mongoose from "mongoose";
export const connectDB = async (app) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    app.on("error", (error) => {
      console.log("ERROR", error);
    });
    app.listen(process.env.PORT, () => {
      console.log(`Database connected successfully`);
      console.log(`Server is running on ${process.env.BASE_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};
