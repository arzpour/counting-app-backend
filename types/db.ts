import { Connection } from "mongoose";
import { Request } from "express";

export interface AuthRequest extends Request {
  // user?: {
  //   id: string;
  //   customerSlug: string;
  // };
  user?: any;
  db?: Connection;
}
