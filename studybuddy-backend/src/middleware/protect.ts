import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.model";

dotenv.config();

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Try to get token from cookie OR Authorization header
    const token =
      req.cookies?.accesstoken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId).select("_id name email");
    if (!user) {
      return res.status(401).json({ message: "User not found or deleted" });
    }

    (req as any).user = {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
