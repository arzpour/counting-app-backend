import express, { Request, Response, Router } from "express";
import Expense from "../models/expenses";

const router: Router = express.Router();

// GET all expenses
router.get("/", async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// GET expense by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Error fetching expense" });
  }
});

// GET expenses by category
router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({ category: req.params.category });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// GET expenses by recipient person ID
router.get("/recipient/:personId", async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({ recipientPersonId: req.params.personId });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// GET expenses by date range
router.get("/date-range", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await Expense.find({
      expenseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// POST create new expense
router.post("/", async (req: Request, res: Response) => {
  try {
    const newExpense = new Expense(req.body);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error: any) {
    console.error("Error creating expense:", error);
    res.status(500).json({ 
      error: "Error creating expense", 
      details: error.message 
    });
  }
});

// PUT update expense by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(updatedExpense);
  } catch (error: any) {
    console.error("Error updating expense:", error);
    res.status(500).json({ 
      error: "Error updating expense", 
      details: error.message 
    });
  }
});

// DELETE expense by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ 
      message: "Expense deleted successfully", 
      expense: deletedExpense 
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Error deleting expense" });
  }
});

export default router;

