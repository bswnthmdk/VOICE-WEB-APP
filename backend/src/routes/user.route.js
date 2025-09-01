import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUser,
  deleteAccount,
} from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// Public routes
userRouter.route("/signup").post(signupUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

// Protected routes
userRouter.route("/logout").post(verifyAccessToken, logoutUser);
userRouter.route("/current-user").get(verifyAccessToken, getCurrentUser);
userRouter.route("/update-profile").put(verifyAccessToken, updateUser);
userRouter.route("/delete-account").delete(verifyAccessToken, deleteAccount);

export default userRouter;
