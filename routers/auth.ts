import { Router } from "express";
import { login, logout } from "../controllers/auth";
import { validate } from "../middleware/validate";
import { userLoginValidationSchema } from "../validations/user";

const router = Router();

router.post("/login", validate(userLoginValidationSchema), login);
router.post("/logout", logout);

export default router;

