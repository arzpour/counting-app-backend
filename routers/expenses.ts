import { Router } from "express";
import {
  createExpense,
  deleteExpenseById,
  editExpenseById,
  getAllExpenses,
  getExpenseByCategoryId,
  getExpenseById,
  getExpensesByDate,
  getExpensesByPersonId,
} from "../controllers/expenses";

const router = Router();

router.get("/", getAllExpenses);
router.get("/byId/:id", getExpenseById);
router.get("/byCategoryId/:category", getExpenseByCategoryId);
router.get("/recipient/:personId", getExpensesByPersonId);
router.get("/date-range", getExpensesByDate);
router.post("/", createExpense);
router.put("/byId/:id", editExpenseById);
router.delete("/byId/:id", deleteExpenseById);

export default router;
