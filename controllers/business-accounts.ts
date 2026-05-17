import express, { Response, Router } from "express";
import { getBusinessAccountsModel } from "../models/business-accounts";
import { AuthRequest } from "../types/db";

const router: Router = express.Router();

// GET all business accounts
export const getAllBusinessAccounts = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const accounts = await BusinessAccountsModel.find();
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching business accounts:", error);
    res.status(500).json({ error: "Error fetching business accounts" });
  }
};

// GET active business accounts
export const getActiveBusinessAccounts = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const accounts = await BusinessAccountsModel.find({ isActive: true });
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching active accounts:", error);
    res.status(500).json({ error: "Error fetching active accounts" });
  }
};

// GET business account by ID
export const getBusinessAccountById = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const account = await BusinessAccountsModel.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json(account);
  } catch (error) {
    console.error("Error fetching business account:", error);
    res.status(500).json({ error: "Error fetching business account" });
  }
};

// GET business account by account number
export const getBusinessAccountByAccountNumber = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const account = await BusinessAccountsModel.findOne({
      accountNumber: req.params.accountNumber,
    });
    if (!account) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json(account);
  } catch (error) {
    console.error("Error fetching business account:", error);
    res.status(500).json({ error: "Error fetching business account" });
  }
};

// POST create new business account
export const createBusinessAccount = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const newAccount = new BusinessAccountsModel(req.body);
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error: any) {
    console.error("Error creating business account:", error);
    res.status(500).json({
      error: "Error creating business account",
      details: error.message,
    });
  }
};

// PUT update business account by ID
export const editBusinessAccountById = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const updatedAccount = await BusinessAccountsModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedAccount) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json(updatedAccount);
  } catch (error: any) {
    console.error("Error updating business account:", error);
    res.status(500).json({
      error: "Error updating business account",
      details: error.message,
    });
  }
};

// PUT update balance
export const editBusinessAccountBalanceById = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const { amount } = req.body;
    const account = await BusinessAccountsModel.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ error: "Business account not found" });
    }

    account.currentBalance = (account.currentBalance || 0) + amount;
    await account.save();

    res.json(account);
  } catch (error: any) {
    console.error("Error updating balance:", error);
    res.status(500).json({
      error: "Error updating balance",
      details: error.message,
    });
  }
};

// DELETE business account by ID
export const deleteBusinessAccountById = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const BusinessAccountsModel = getBusinessAccountsModel(req.db);
    if (!BusinessAccountsModel) {
      return res
        .status(500)
        .json({ error: "BusinessAccounts model is not initialized" });
    }
    const deletedAccount = await BusinessAccountsModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedAccount) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json({
      message: "Business account deleted successfully",
      account: deletedAccount,
    });
  } catch (error) {
    console.error("Error deleting business account:", error);
    res.status(500).json({ error: "Error deleting business account" });
  }
};

export default router;
