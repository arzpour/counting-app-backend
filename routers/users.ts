import express, { Request, Response, Router } from "express";
import { getUserModel } from "../models/user";
import { AuthRequest } from "../types/db";

const router: Router = express.Router();

// GET all users
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const UserModel = getUserModel(req.db);
    if (!UserModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const user = await UserModel.find();
    res.json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;
