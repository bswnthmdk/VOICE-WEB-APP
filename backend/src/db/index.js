import mongoose from "mongoose";

export const connectDB = async (app) => {
  console.log("Attempting to connect to MongoDB...");
  console.log("MongoDB URL:", process.env.MONGODB_URL ? "Set" : "Not set");

  try {
    console.log("Connecting to database...");
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully!");
    console.log("Database Host:", connectionInstance.connection.host);
    console.log("Database Name:", connectionInstance.connection.name);

    app.on("error", (error) => {
      console.error("Express App Error:", error);
    });

    const PORT = process.env.PORT || 8000;
    const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

    app.listen(PORT, () => {
      console.log("Server Configuration:");
      console.log(`   Port: ${PORT}`);
      console.log(`   Base URL: ${BASE_URL}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `   CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`
      );
      console.log("Server is running successfully!");
      console.log("Available endpoints:");
      console.log(`   Health Check: ${BASE_URL}/health`);
      console.log(`   User API: ${BASE_URL}/voice-web-app/api/users`);
      console.log("Server ready to accept requests");
    });
  } catch (error) {
    console.error("Database connection failed!");
    console.error("Error details:", error.message);
    console.error("Please check your MongoDB connection string");
    process.exit(1);
  }
};
