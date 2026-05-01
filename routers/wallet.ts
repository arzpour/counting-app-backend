import { Router } from "express";
import {
  deleteTransaction,
  updateMultipleWalletTransfer,
  updateWalletTransfer,
} from "../controllers/wallet";

const router = Router();

router.post("/update-wallet-transfer", updateWalletTransfer);
router.post("/update-multiple-wallets", updateMultipleWalletTransfer);
router.delete("/remove-transaction", deleteTransaction);

export default router;
