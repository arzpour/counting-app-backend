import { Request, Response, NextFunction } from "express";
import User from "../models/user";
// import jwt from "jsonwebtoken";
import * as jwt from "jsonwebtoken";

interface SignTokenResult {
  accessToken: string;
}

const signToken = (id: string): SignTokenResult => {
  const accessToken = jwt.sign(
    { id },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    }
  );

  return { accessToken };
};

export const generateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = jwt.sign(
    { id: (req as any).userId },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    }
  );

  res.status(200).json({
    status: "success",
    token: { accessToken },
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      res.status(401).json({ message: "incorrect username or password" });
      return;
    }

    const { accessToken } = signToken(user._id.toString());

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      token: { accessToken },
      data: { user },
    });
  } catch (error) {
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
