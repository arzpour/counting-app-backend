import { Router } from "express";
import {
  createLoan,
  deleteLoanById,
  editLoanById,
  getAllLoans,
  getLoanById,
  getLoansByPersonId,
  getLoansByStatus,
} from "../controllers/loans";

const router = Router();

router.get("/", getAllLoans);
router.get("/byId/:id", getLoanById);
router.get("/borrower/:personId", getLoansByPersonId);
router.get("/byStatus/:status", getLoansByStatus);
router.post("/", createLoan);
router.put("/byId/:id", editLoanById);
router.delete("/byId/:id", deleteLoanById);

export default router;
