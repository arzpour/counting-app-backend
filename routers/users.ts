import express, { Request, Response, Router } from "express";
import User from "../models/user";

const router: Router = express.Router();

// GET all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;
