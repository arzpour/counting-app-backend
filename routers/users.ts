import { Router } from "express";
import { getAllUsers } from "../controllers/users";

const router = Router();

router.get("/", getAllUsers);

export default router;
