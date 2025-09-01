import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

console.log("Auth Middleware Loaded");

export const verifyAccessToken = async (req, res, next) => {
  console.log("Verifying access token...");

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token source:", {
      fromCookies: !!req.cookies?.accessToken,
      fromHeader: !!req.header("Authorization"),
    });

    if (!token) {
      console.log("No access token provided");
      throw new ApiError(401, false, "Unauthorized request");
    }

    console.log("Decoding access token...");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Token decoded, user ID:", decodedToken._id);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.log("User not found for token:", decodedToken._id);
      throw new ApiError(401, false, "Invalid Access Token");
    }

    console.log("Access token verified for user:", user.username);
    req.user = user;
    next();
  } catch (error) {
    console.error("Access token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      console.log("Access token expired");
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      console.log("Invalid access token format");
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
        code: "INVALID_TOKEN",
      });
    }

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: error.message,
    });
  }
};
