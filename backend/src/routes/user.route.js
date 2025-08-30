import express from "express";
import { signupUser, loginUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

// Grouping routes by path
userRouter.route("/signup").post(signupUser);
userRouter.route("/login").post(loginUser);

export default userRouter;
