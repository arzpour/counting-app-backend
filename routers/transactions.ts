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
router.get("/id/:id", getTransactionById);
router.get("/deal/:dealId", getTransactionByDealId);
router.get("/person/:personId", getTransactionByPersonId);
router.get("/account/:accountId", getTransactionsByBusinessAccountId);
router.get("/type/:type", getTransactionsByType);
router.get("/date-range", getTransactionsByDate);
router.post("/", createTransaction);
router.put("/id/:id", editTransactionById);
router.delete("/id/:id", deleteTransactionById);

export default router;
