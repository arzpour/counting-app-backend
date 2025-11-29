import { Router } from "express";
import * as controller from "../controllers/settings";

const router = Router();

router.get("/", controller.getAllSettings);
router.get("/:category", controller.getSettingByCategory);
router.post("/", controller.createCategory);
router.post("/:category/add", controller.addOption);
router.delete("/:category/delete", controller.deleteOption);

export default router;
