import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/db";

// interface AuthRequest extends Request {
//   user?: any;
// }

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err || !decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.user = decoded;

      next();
    },
  );
};

// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);

//     req.user = user;
//     next();
//   });
// };
