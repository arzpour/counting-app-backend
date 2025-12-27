import { Request, Response, Router } from "express";
import Transaction from "../models/transactions-new";

const router = Router();

// GET all transactions
router.get("/", async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// GET transaction by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Error fetching transaction" });
  }
});

// GET transactions by deal ID
router.get("/deal/:dealId", async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({ dealId: req.params.dealId });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// GET transactions by person ID
router.get("/person/:personId", async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      personId: req.params.personId,
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// GET transactions by business account ID
router.get("/account/:accountId", async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      bussinessAccountId: req.params.accountId,
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// GET transactions by type
router.get("/type/:type", async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({ type: req.params.type });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// GET transactions by date range
router.get("/date-range", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await Transaction.find({
      transactionDate: {
        $gte: String(startDate),
        $lte: String(endDate),
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// POST create new transaction
router.post("/", async (req: Request, res: Response) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      error: "Error creating transaction",
      details: error.message,
    });
  }
});

// PUT update transaction by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(updatedTransaction);
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      error: "Error updating transaction",
      details: error.message,
    });
  }
});

// DELETE transaction by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({
      message: "Transaction deleted successfully",
      transaction: deletedTransaction,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Error deleting transaction" });
  }
});

export default router;
