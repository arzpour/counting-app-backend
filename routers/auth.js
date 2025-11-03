const router = require("express").Router();
// const { asyncHandler } = require("../utils/async-handler");
// const { validator } = require("../validations/validator");
const { login, logout } = require("../controllers/auth");

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
