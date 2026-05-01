import { Router } from "express";
import {
  createBusinessAccount,
  deleteBusinessAccountById,
  editBusinessAccountBalanceById,
  editBusinessAccountById,
  getActiveBusinessAccounts,
  getAllBusinessAccounts,
  getBusinessAccountByAccountNumber,
  getBusinessAccountById,
} from "../controllers/business-accounts";

const router = Router();

router.get("/", getAllBusinessAccounts);
router.get("/active", getActiveBusinessAccounts);
router.get("/byId/:id", getBusinessAccountById);
router.get("/account-number/:accountNumber", getBusinessAccountByAccountNumber);
router.post("/", createBusinessAccount);
router.put("/byId/:id", editBusinessAccountById);
router.put("/byId/:id/balance", editBusinessAccountBalanceById);
router.delete("/byId/:id", deleteBusinessAccountById);

export default router;
