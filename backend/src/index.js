import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
const PORT = process.env.PORT || 8001;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
