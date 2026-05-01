import mongoose from "mongoose";
import type { Response, NextFunction } from "express";
import { dbConfig } from "../config";
import { AuthRequest } from "../types/db";

type CustomerSlug = keyof typeof dbConfig;
const connections = new Map<string, any>();

export const connectToDatabase = async (customerSlug: CustomerSlug) => {
  if (connections.has(customerSlug)) return connections.get(customerSlug);

  const uri = dbConfig[customerSlug];
  console.log("🚀 ~ connectToDatabase ~ uri:", uri);
  if (!uri) throw new Error("Database not found for this customerSlug");

  const conn = await mongoose
    .createConnection(uri, { dbName: "importDB" })
    .asPromise();

  connections.set(customerSlug, conn);

  return conn;
};

export const attachDatabase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const customerSlug = req.user?.customerSlug;
  console.log("🚀 ~ attachDatabase ~ req.user?.customerSlug:", req.user?.customerSlug)
  console.log("🚀 ~ attachDatabase ~ req:", req.user)
  if (!customerSlug)
    return res.status(401).json({ message: "Missing customerSlug" });

  const connection = await connectToDatabase(customerSlug);

  if (connection) {
    console.log("✅ Connected to MongoDB Atlas");
  }
  req.db = connection;
  next();
};
