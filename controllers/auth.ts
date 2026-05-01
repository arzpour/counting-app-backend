import { Request, Response, NextFunction } from "express";
import { User, userSchema } from "../models/user";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/db";
import { connectToDatabase } from "../db/connectToDB";

interface SignTokenResult {
  accessToken: string;
}

const signToken = (id: string, customerSlug: string): SignTokenResult => {
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "7d";

  const accessToken = jwt.sign(
    { id, customerSlug },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn } as any,
  );

  return { accessToken };
};

export const generateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "7d";

  const accessToken = jwt.sign(
    { id: (req as any).userId },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn } as any,
  );

  res.status(200).json({
    status: "success",
    token: { accessToken },
  });
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, password, customerSlug } = req.body;
    if (!customerSlug) {
      res.status(400).json({ message: "Missing customerSlug in request." });
      return;
    }

    const connection = await connectToDatabase(customerSlug);
    if (!connection) {
      res
        .status(500)
        .json({ message: "Failed to connect to database for customer." });
      return;
    }

    req.db = connection;
    const User = connection.model("User", userSchema);

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "incorrect username or password" });
      return;
    }

    const { accessToken } = signToken(user._id.toString(), customerSlug);

    res.status(200).json({
      status: "success",
      token: { accessToken },
      data: {
        user: {
          id: user._id,
          username: user.username,
        },
      },
      customerSlug,
    });
  } catch (error) {
    console.error("Error during login:", error);
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
