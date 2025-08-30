import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

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

    // 4.   Return success response with user data
    const user = await User.findById(userExists._id).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, true, "User logged in successfully", user));
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
