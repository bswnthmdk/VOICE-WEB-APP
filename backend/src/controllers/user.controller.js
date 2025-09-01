import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      false,
      "Something went wrong while generating access and refresh token"
    );
  }
};

/*
1. Get user data from request body
2. Validate user data
3. Check if user already exists by email or/and username(If user exists, return error response)
4. Check 'avatar' & 'coverImage' is present in request files or not
5. If user does not exist, check for all required fields present or not
6. Upload 'avatar' & 'coverImage' to cloudinary(cloud storage)
7. Create user object with user data to be saved in database
8. Check whether user is created successfully or not
9. Remove 'password'(will be encrypted) & 'refreshToken'(will be null) from success response
10. Return success response with user data
*/

export const signupUser = async (req, res) => {
  try {
    // 1.   Get user data from request body
    const { fullname, username, email, password } = req.body;

    // 2.   Validate user data
    if (!fullname || !username || !email || !password) {
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
      throw new ApiError(400, false, "Invalid email format");
    }

    // 3.   Check if user already exists by email or/and username
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      throw new ApiError(
        409,
        false,
        "User already exists with this email or username"
      );
    }

    // 4.   Create user object with user data to be saved in database
    const newUser = new User({
      fullname: fullname.trim(),
      username: username.toLowerCase(),
      email,
      password, // will be hashed in user model pre-save hook
    });
    await newUser.save();

    // 5.   Check whether user is created successfully or not
    const createdUser = await User.findById(newUser._id).select("-password");
    if (!createdUser) {
      throw new ApiError(400, false, "Failed to sign up user");
    }

    // 6.   Return success response with user data
    return res
      .status(201)
      .json(
        new ApiResponse(201, true, "User signed up successfully", createdUser)
      );
  } catch (error) {
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
      errors: error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1.   Validate user data
    if (!username || !password) {
      throw new ApiError(400, false, "Username or Password is missing");
    }

    // 2.   Check if user exists by username
    const userExists = await User.findOne({ username });
    if (!userExists) {
      throw new ApiError(404, false, "User doesn't exist with this username");
    }

    // 3.   Compare password
    const isPasswordCorrect = await userExists.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, false, "Incorrect Password");
    }

    // 4.   Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      userExists._id
    );

    // 5.   Get user data without sensitive fields
    const loggedInUser = await User.findById(userExists._id).select(
      "-password -refreshToken"
    );

    // 6.   Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    // 7.   Return success response with tokens
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
      errors: error,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Clear refresh token from database
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
      sameSite: "strict",
    };

    return res
      .status(200)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, true, "User logged out successfully", {}));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: error,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, false, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, false, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, false, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(200, true, "Access token refreshed successfully", {
          accessToken,
        })
      );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
        code: "REFRESH_TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
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
      errors: error,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, true, "User fetched successfully", req.user));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: error,
    });
  }
};

/*
Update User Profile
1. Get user data from request body (fullname, username, currentPassword, newPassword)
2. Validate required fields and password confirmation if changing password
3. Check if current password is correct (if changing password)
4. Check if new username is already taken (if changing username)
5. Update user fields
6. Return updated user data without sensitive fields
*/

export const updateUser = async (req, res) => {
  try {
    const { newFullname, newUsername, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!newFullname && !newUsername && !newPassword) {
      throw new ApiError(
        400,
        false,
        "At least one field is required for update"
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, false, "User not found");
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new ApiError(
          400,
          false,
          "Current password is required to change password"
        );
      }

      const isCurrentPasswordCorrect = await user.isPasswordCorrect(
        currentPassword
      );
      if (!isCurrentPasswordCorrect) {
        throw new ApiError(400, false, "Current password is incorrect");
      }
    }

    if (newUsername && newUsername !== user.username) {
      const usernameExists = await User.findOne({
        username: newUsername.toLowerCase(),
        _id: { $ne: userId },
      });

      if (usernameExists) {
        throw new ApiError(
          409,
          false,
          "Username is already taken by another user"
        );
      }
    }

    if (newFullname) user.fullname = newFullname.trim();
    if (newUsername) user.username = newUsername.toLowerCase();
    if (newPassword) user.password = newPassword; // will be hashed by pre-save hook

    const updatedUser = await user.save();

    return res.status(200).json(
      new ApiResponse(200, true, "User profile updated successfully", {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
      })
    );
  } catch (error) {
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
