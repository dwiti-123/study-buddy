import express from "express";
import asyncHandler from "express-async-handler";
import { forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword } from "../../controller/registeruser";

const authRouter = express.Router();

authRouter.post("/register", asyncHandler(registerUser));
authRouter.post("/login", asyncHandler(loginUser));
authRouter.post("/logout", asyncHandler(logoutUser));
authRouter.get("/refresh", asyncHandler(refreshAccessToken));
authRouter.post("/forgot-password", asyncHandler(forgotPassword));
authRouter.post("/reset-password", asyncHandler(resetPassword));
export default authRouter;
