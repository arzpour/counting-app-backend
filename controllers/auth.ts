import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

interface SignTokenResult {
  accessToken: string;
}

const signToken = (id: string): SignTokenResult => {
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "7d";
  const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_TOKEN_SECRET is not configured");
  }

  const accessToken = jwt.sign(
    { id },
    secret,
    { expiresIn } as any
  );

  return { accessToken };
};

export const generateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "7d";
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new Error("JWT_ACCESS_TOKEN_SECRET is not configured");
    }

    const accessToken = jwt.sign(
      { id: (req as any).userId },
      secret,
      { expiresIn } as any
    );

    res.status(200).json({
      status: "success",
      token: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if JWT secret is configured
    if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
      throw new Error("JWT_ACCESS_TOKEN_SECRET is not configured");
    }

    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ 
        status: "error",
        message: "Username and password are required" 
      });
      return;
    }

    const user = await User.findOne({ username }).select("+password");
    console.log("🚀 ~ login ~ user:", user);

    if (!user) {
      res.status(401).json({ 
        status: "error",
        message: "incorrect username or password" 
      });
      return;
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    console.log("🚀 ~ login ~ isPasswordCorrect:", isPasswordCorrect)
    if (!isPasswordCorrect) {
      res.status(401).json({ 
        status: "error",
        message: "incorrect username or password" 
      });
      return;
    }

    const { accessToken } = signToken(user._id.toString());

    // Remove password from user object before sending response
    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      status: "success",
      token: { accessToken },
      data: { user: userObject },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId);

    if (user) {
      (user as any).refreshToken = null;
      await user.save();
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export { signToken };
