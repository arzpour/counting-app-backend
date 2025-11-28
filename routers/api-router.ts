import express, { Router } from "express";
const router: Router = express.Router();

import authRouter from "./auth";
import carRouter from "./car";
import chequeRouter from "./cheque";
import otherApiRouter from "./other-api-router";
import transactionRouter from "./transaction";
import settingRouter from "./settings";

router.use("/auth", authRouter);
router.use("/cars", carRouter);
router.use("/transactions", transactionRouter);
router.use("/cheques", chequeRouter);
router.use("/unpaid", chequeRouter);
router.use("/others", otherApiRouter);
router.use("/settings", settingRouter);

export default router;

