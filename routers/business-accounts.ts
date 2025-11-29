import express, { Request, Response, Router } from "express";
import BusinessAccounts from "../models/business-accounts";

const router: Router = express.Router();

// GET all business accounts
router.get("/", async (req: Request, res: Response) => {
  try {
    const accounts = await BusinessAccounts.find();
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching business accounts:", error);
    res.status(500).json({ error: "Error fetching business accounts" });
  }
});

// GET active business accounts
router.get("/active", async (req: Request, res: Response) => {
  try {
    const accounts = await BusinessAccounts.find({ isActive: true });
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching active accounts:", error);
    res.status(500).json({ error: "Error fetching active accounts" });
  }
});

// GET business account by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const account = await BusinessAccounts.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json(account);
  } catch (error) {
    console.error("Error fetching business account:", error);
    res.status(500).json({ error: "Error fetching business account" });
  }
});

// GET business account by account number
router.get("/account-number/:accountNumber", async (req: Request, res: Response) => {
  try {
    const account = await BusinessAccounts.findOne({ 
      accountNumber: req.params.accountNumber 
    });
    if (!account) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json(account);
  } catch (error) {
    console.error("Error fetching business account:", error);
    res.status(500).json({ error: "Error fetching business account" });
  }
});

// POST create new business account
router.post("/", async (req: Request, res: Response) => {
  try {
    const newAccount = new BusinessAccounts(req.body);
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error: any) {
    console.error("Error creating business account:", error);
    res.status(500).json({ 
      error: "Error creating business account", 
      details: error.message 
    });
  }
});

// PUT update business account by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const updatedAccount = await BusinessAccounts.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedAccount) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json(updatedAccount);
  } catch (error: any) {
    console.error("Error updating business account:", error);
    res.status(500).json({ 
      error: "Error updating business account", 
      details: error.message 
    });
  }
});

// PUT update balance
router.put("/id/:id/balance", async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const account = await BusinessAccounts.findById(req.params.id);
    
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
      details: error.message 
    });
  }
});

// DELETE business account by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedAccount = await BusinessAccounts.findByIdAndDelete(req.params.id);
    if (!deletedAccount) {
      return res.status(404).json({ error: "Business account not found" });
    }
    res.json({ 
      message: "Business account deleted successfully", 
      account: deletedAccount 
    });
  } catch (error) {
    console.error("Error deleting business account:", error);
    res.status(500).json({ error: "Error deleting business account" });
  }
});

export default router;

