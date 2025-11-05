const express = require("express");
const router = express.Router();
const controller = require("../controllers/settings");

router.get("/", controller.getAllSettings);
router.get("/:category", controller.getSettingByCategory);
router.post("/", controller.createCategory);
router.post("/:category/add", controller.addOption);
router.delete("/:category/delete", controller.deleteOption);

module.exports = router;
