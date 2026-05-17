import express, { Response, Router } from "express";
import { getExpenseModel } from "../models/expenses";
import { AuthRequest } from "../types/db";

const router: Router = express.Router();

// GET all expenses
export const getAllExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const expenses = await ExpenseModel.find();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
};

// GET expense by ID
export const getExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const expense = await ExpenseModel.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Error fetching expense" });
  }
};

// GET expenses by category
export const getExpenseByCategoryId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const expenses = await ExpenseModel.find({ category: req.params.category });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
};

// GET expenses by recipient person ID
export const getExpensesByPersonId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const expenses = await ExpenseModel.find({
      recipientPersonId: req.params.personId,
    });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
};

// GET expenses by date range
export const getExpensesByDate = async (req: AuthRequest, res: Response) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const { startDate, endDate } = req.query;
    const expenses = await ExpenseModel.find({
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
};

// POST create new expense
export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const newExpense = new ExpenseModel(req.body);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error: any) {
    console.error("Error creating expense:", error);
    res.status(500).json({
      error: "Error creating expense",
      details: error.message,
    });
  }
};

// PUT update expense by ID
export const editExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(updatedExpense);
  } catch (error: any) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      error: "Error updating expense",
      details: error.message,
    });
  }
};

// DELETE expense by ID
export const deleteExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const ExpenseModel = getExpenseModel(req.db);
    if (!ExpenseModel) {
      return res
        .status(500)
        .json({ error: "Expense model is not initialized" });
    }
    const deletedExpense = await ExpenseModel.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({
      message: "Expense deleted successfully",
      expense: deletedExpense,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Error deleting expense" });
  }
};

export default router;
