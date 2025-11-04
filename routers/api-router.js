const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const carRouter = require("./car");
const chequeRouter = require("./cheque");
const otherApiRouter = require("./other-api-router");
const transactionRouter = require("./transaction");

router.use("/auth", authRouter);
router.use("/cars", carRouter);
router.use("/transactions", transactionRouter);
router.use("/cheques", chequeRouter);
router.use("/unpaid", chequeRouter);
router.use("/others", otherApiRouter);

module.exports = router;
