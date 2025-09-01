import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

console.log("User Model Loading...");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: { type: String, required: true, trim: true, index: true },
    password: { type: String, required: [true, "Password is required"] },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hash");
    return next();
  }

  console.log("Hashing password for user:", this.username);
  this.password = await bcrypt.hash(this.password, 10);
  console.log("Password hashed successfully");
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  console.log("Comparing password for user:", this.username);
  const result = await bcrypt.compare(password, this.password);
  console.log("Password comparison result:", result ? "Match" : "No match");
  return result;
};

userSchema.methods.generateAccessToken = function () {
  console.log("Generating access token for user:", this.username);
  const token = jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  });
  console.log("Access token generated");
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  console.log("Generating refresh token for user:", this.username);
  const token = jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
  });
  console.log("Refresh token generated");
  return token;
};

console.log("User Model Loaded Successfully");

export const User = mongoose.model("User", userSchema);
