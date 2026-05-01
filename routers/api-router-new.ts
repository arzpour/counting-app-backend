import express, { Router } from "express";
// Import all routers
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
import authRouter from "./auth";
import usersRouter from "./users";
import walletRouter from "./wallet";
import exportToExcelRouter from "./exportToExcel";
import { authenticateJWT } from "../middleware/auth";
import { attachDatabase } from "../db/connectToDB";

const router: Router = express.Router();


// Authentication routes
router.use("/auth", authRouter);

// Main entity routes
router.use("/vehicles", authenticateJWT, attachDatabase, vehiclesRouter);
router.use("/deals", authenticateJWT, attachDatabase, dealsRouter);
router.use("/people", authenticateJWT, attachDatabase, peopleRouter);
router.use("/cheques", authenticateJWT, attachDatabase, chequesRouter);
router.use(
  "/transactions",
  authenticateJWT,
  attachDatabase,
  transactionsRouter,
);
router.use(
  "/business-accounts",
  authenticateJWT,
  attachDatabase,
  businessAccountsRouter,
);
router.use("/salaries", authenticateJWT, attachDatabase, salariesRouter);
router.use("/expenses", authenticateJWT, attachDatabase, expensesRouter);
router.use("/loans", authenticateJWT, attachDatabase, loansRouter);
router.use("/settings", authenticateJWT, attachDatabase, settingsRouter);
// router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/wallet", authenticateJWT, attachDatabase, walletRouter);
router.use(
  "/exportToExcel",
  authenticateJWT,
  attachDatabase,
  exportToExcelRouter,
);

export default router;
