import { Router } from "express";
import {
  createTransaction,
  deleteTransactionById,
  editTransactionById,
  getAllTransactions,
  getTransactionByDealId,
  getTransactionById,
  getTransactionByPersonId,
  getTransactionsByBusinessAccountId,
  getTransactionsByDate,
  getTransactionsByType,
} from "../controllers/transactions";

const router = Router();

router.get("/", getAllTransactions);
router.get("/byId/:id", getTransactionById);
router.get("/byDealId/:dealId", getTransactionByDealId);
router.get("/byPersonId/:personId", getTransactionByPersonId);
router.get("/byAccountId/:accountId", getTransactionsByBusinessAccountId);
router.get("/byType/:type", getTransactionsByType);
router.get("/byDateRange", getTransactionsByDate);
router.post("/", createTransaction);
router.put("/byId/:id", editTransactionById);
router.delete("/byId/:id", deleteTransactionById);

export default router;
