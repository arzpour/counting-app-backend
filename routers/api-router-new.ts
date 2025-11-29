import express, { Router } from "express";
// Import all routers
import authRouter from "./auth";
import vehiclesRouter from "./vehicles";
import dealsRouter from "./deals";
import peopleRouter from "./people";
import chequesRouter from "./cheques-new";
import transactionsRouter from "./transactions-new";
import businessAccountsRouter from "./business-accounts";
import salariesRouter from "./salaries";
import expensesRouter from "./expenses";
import loansRouter from "./loans";
import settingsRouter from "./settings";

const router: Router = express.Router();

// Authentication routes
router.use("/auth", authRouter);

// Main entity routes
router.use("/vehicles", vehiclesRouter);
router.use("/deals", dealsRouter);
router.use("/people", peopleRouter);
router.use("/cheques", chequesRouter);
router.use("/transactions", transactionsRouter);
router.use("/business-accounts", businessAccountsRouter);
router.use("/salaries", salariesRouter);
router.use("/expenses", expensesRouter);
router.use("/loans", loansRouter);
router.use("/settings", settingsRouter);

export default router;

