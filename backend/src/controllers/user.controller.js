import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

console.log("User Controller Loaded");

// Generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    console.log("Generating tokens for user:", userId);
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for token generation:", userId);
      throw new ApiError(404, false, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    console.log("Tokens generated successfully for user:", userId);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation failed:", error);
    throw new ApiError(
      500,
      false,
      "Something went wrong while generating access and refresh token"
    );
  }
};

export const refreshAccessToken = async (req, res) => {
  console.log("Refresh token request received");

  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    console.log("Refresh token from:", {
      cookies: !!req.cookies.refreshToken,
      body: !!req.body.refreshToken,
    });

    if (!incomingRefreshToken) {
      console.log("No refresh token provided");
      throw new ApiError(401, false, "Unauthorized request");
    }

    console.log("Verifying refresh token...");
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      console.log("User not found for refresh token");
      throw new ApiError(401, false, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      console.log("Refresh token mismatch");
      throw new ApiError(401, false, "Refresh token is expired or used");
    }

    console.log("Refresh token valid, generating new tokens");
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    console.log("Setting new refresh token cookie");
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(200, true, "Access token refreshed successfully", {
          accessToken,
        })
      );
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error.name === "TokenExpiredError") {
      console.log("Refresh token expired");
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
        code: "REFRESH_TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      console.log("Invalid refresh token format");
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
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

export const getCurrentUser = async (req, res) => {
  console.log("Get current user request for:", req.user.username);

  try {
    console.log("Returning user data:", {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, true, "User fetched successfully", req.user));
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: error.message,
    });
  }
};

export const signupUser = async (req, res) => {
  console.log("Signup request received");
  console.log("Request body:", {
    ...req.body,
    password: req.body.password ? "***" : undefined,
  });

  try {
    const { fullname, username, email, password } = req.body;

    // Validate user data
    if (!fullname || !username || !email || !password) {
      console.log("Missing required fields");
      throw new ApiError(
        400,
        false,
        "Fullname or Username or Email or Password is missing"
      );
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    if (!isValidEmail(email)) {
      console.log("Invalid email format:", email);
      throw new ApiError(400, false, "Invalid email format");
    }

    console.log("🔍 Checking if user exists...");
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      console.log("User already exists:", {
        email: userExists.email === email,
        username: userExists.username === username,
      });
      throw new ApiError(
        409,
        false,
        "User already exists with this email or username"
      );
    }

    console.log("Creating new user...");
    const newUser = new User({
      fullname: fullname.trim(),
      username: username.toLowerCase(),
      email,
      password, // will be hashed in user model pre-save hook
    });
    await newUser.save();

    const createdUser = await User.findById(newUser._id).select("-password");
    if (!createdUser) {
      console.log("Failed to create user");
      throw new ApiError(400, false, "Failed to sign up user");
    }

    console.log("User created successfully:", {
      id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, true, "User signed up successfully", createdUser)
      );
  } catch (error) {
    console.error("Signup error:", error);
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

export const loginUser = async (req, res) => {
  console.log("Login request received");
  console.log("Login attempt for username:", req.body.username);

  try {
    const { username, password } = req.body;

    // Validate user data
    if (!username || !password) {
      console.log("Missing username or password");
      throw new ApiError(400, false, "Username or Password is missing");
    }

    console.log("Looking for user:", username);
    const userExists = await User.findOne({ username });
    if (!userExists) {
      console.log("User not found:", username);
      throw new ApiError(404, false, "User doesn't exist with this username");
    }

    console.log("Verifying password...");
    const isPasswordCorrect = await userExists.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      console.log("Incorrect password for user:", username);
      throw new ApiError(400, false, "Incorrect Password");
    }

    console.log("Generating tokens...");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      userExists._id
    );

    const loggedInUser = await User.findById(userExists._id).select(
      "-password -refreshToken"
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    console.log("Setting cookies with options:", cookieOptions);
    console.log("Login successful for user:", {
      id: loggedInUser._id,
      username: loggedInUser.username,
      email: loggedInUser.email,
    });

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, true, "User logged in successfully", {
          user: loggedInUser,
          accessToken,
        })
      );
  } catch (error) {
    console.error("Login error:", error);
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

export const logoutUser = async (req, res) => {
  console.log("Logout request for user:", req.user.username);

  try {
    console.log("Clearing refresh token from database...");
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    };

    console.log("Clearing refresh token cookie");
    console.log("Logout successful for user:", req.user.username);

    return res
      .status(200)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, true, "User logged out successfully", {}));
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  console.log("Update profile request for user:", req.user.username);
  console.log("Update data:", {
    ...req.body,
    currentPassword: req.body.currentPassword ? "***" : undefined,
    newPassword: req.body.newPassword ? "***" : undefined,
  });

  try {
    const { newFullname, newUsername, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!newFullname && !newUsername && !newPassword) {
      console.log("No fields to update");
      throw new ApiError(
        400,
        false,
        "At least one field is required for update"
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for update:", userId);
      throw new ApiError(404, false, "User not found");
    }

    if (newPassword) {
      if (!currentPassword) {
        console.log("Current password required for password change");
        throw new ApiError(
          400,
          false,
          "Current password is required to change password"
        );
      }

      console.log("Verifying current password...");
      const isCurrentPasswordCorrect = await user.isPasswordCorrect(
        currentPassword
      );
      if (!isCurrentPasswordCorrect) {
        console.log("Current password incorrect");
        throw new ApiError(400, false, "Current password is incorrect");
      }
    }

    if (newUsername && newUsername !== user.username) {
      console.log("Checking if new username is available:", newUsername);
      const usernameExists = await User.findOne({
        username: newUsername.toLowerCase(),
        _id: { $ne: userId },
      });

      if (usernameExists) {
        console.log("Username already taken:", newUsername);
        throw new ApiError(
          409,
          false,
          "Username is already taken by another user"
        );
      }
    }

    console.log("Updating user fields...");
    if (newFullname) {
      console.log("Updating fullname:", newFullname);
      user.fullname = newFullname.trim();
    }
    if (newUsername) {
      console.log("Updating username:", newUsername);
      user.username = newUsername.toLowerCase();
    }
    if (newPassword) {
      console.log("Updating password");
      user.password = newPassword; // will be hashed by pre-save hook
    }

    const updatedUser = await user.save();

    console.log("Profile updated successfully for user:", updatedUser.username);

    return res.status(200).json(
      new ApiResponse(200, true, "User profile updated successfully", {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
      })
    );
  } catch (error) {
    console.error("Update profile error:", error);
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

export const deleteAccount = async (req, res) => {
  console.log("Delete account request for user:", req.user.username);

  try {
    const { currentPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword) {
      console.log("Current password required for account deletion");
      throw new ApiError(
        400,
        false,
        "Current password is required to delete account"
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for deletion:", userId);
      throw new ApiError(404, false, "User not found");
    }

    console.log("Verifying password for account deletion...");
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
      console.log("Incorrect password for account deletion");
      throw new ApiError(400, false, "Current password is incorrect");
    }

    console.log("Cleaning up user data...");
    try {
      // Placeholder for future cleanup logic
      console.log(`Cleaning up data for user: ${userId}`);
    } catch (cleanupError) {
      console.error("Error during data cleanup:", cleanupError);
      // Continue with account deletion even if cleanup fails
    }

    console.log("Deleting user from database...");
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      console.log("Failed to delete user account");
      throw new ApiError(500, false, "Failed to delete user account");
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    };

    console.log("Account deleted successfully:", deletedUser.username);

    return res
      .status(200)
      .clearCookie("refreshToken", cookieOptions)
      .json(
        new ApiResponse(200, true, "Account deleted successfully", {
          message:
            "Your account and all associated data have been permanently deleted",
          deletedAt: new Date().toISOString(),
        })
      );
  } catch (error) {
    console.error("Delete account error:", error);
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
