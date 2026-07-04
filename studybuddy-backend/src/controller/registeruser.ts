import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validation/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../util/generateToken";
import jwt from "jsonwebtoken";
import resend from "../config/sendGrid"


//register user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    const error = result.error.flatten().fieldErrors;
    res.status(400).json({
      success:false,
      message: error,
    });
    return;
  }
  const { name, email, password } = result.data;

  try {
    //  Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success:false,
        message: "A user already exists with this email",
      });
      return;
    }

    //  Hash password (use salt rounds, not a string!)
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({success:true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({success:false, message: "Internal server error" });
  }
};
//login user with refresh and access token
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    res.status(400).json({
      success:false,
      message: "Validation Error",
      errors,
    });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        success:false,
        message: "User not registered. Please sign up before logging in.",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        success:false,
        message: "Invalid password",
      });
      return;
    }
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accesstoken",accessToken,{
      httpOnly:true,
      secure:true,
     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge:7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshtoken",refreshToken,{
      httpOnly:true,
      secure:true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge:15*24*60*60*1000
    })

    res.status(200).json({
      success:true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({success:false, message: "Internal server error" });
  }
};
//logout user
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(204).json({success:false, message: "No token found" });
    return;
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("acesstoken", { httpOnly: true, sameSite: "strict" });
    res.clearCookie("refreshtoken", { httpOnly: true, sameSite: "strict" });
    res.status(204).json({success:false, message: "No user found" });
    return;
  }

  user.refreshToken = "";
  await user.save();

  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  res.status(200).json({success:true, message: "Logged out successfully" });
};
//generate new access token on expirey
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({success:false, message: "No refresh token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({success:false, message: "Invalid refresh token" });
      return;
    }

    //  Rotate refresh token
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    // Set HttpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({success:true, accessToken: newAccessToken });

  } catch {
    res.status(403).json({success:false, message: "Invalid or expired refresh token" });
  }
};


export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


await resend.emails.send({
  from: process.env.EMAIL_FROM as string,
  to: email,
  subject: "Password Reset Request",
  html: `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset.</p>
    <a href="${resetUrl}" 
       style="display:inline-block;padding:10px 20px;
       background:#007bff;color:#fff;border-radius:5px;
       text-decoration:none;">
       Reset Password
    </a>
    <p>This link expires in 15 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,
});

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending reset email",
    });
  }
};


export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({
      success: false,
      message: "Token and new password are required",
    });
    return;
  }

  try {
    const users = await User.find({
      resetPasswordExpiry: { $gt: new Date() },
    });

    let user = null;

    for (const u of users) {
      const isMatch = await bcrypt.compare(
        token,
        u.resetPasswordToken as string
      );
      if (isMatch) {
        user = u;
        break;
      }
    }

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
