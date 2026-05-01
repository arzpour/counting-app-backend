import { Request, Response, Router } from "express";
import Transaction from "../models/transactions-new";

const router = Router();

// GET all transactions
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

// GET transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
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
};


// GET transactions by deal ID
export const getTransactionByDealId = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({ dealId: req.params.dealId });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};


// GET transactions by person ID
export const getTransactionByPersonId = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      personId: req.params.personId,
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};


// GET transactions by business account ID
export const getTransactionsByBusinessAccountId = async (
  req: Request,
  res: Response,
) => {
  try {
    const transactions = await Transaction.find({
      bussinessAccountId: req.params.accountId,
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};


// GET transactions by type
export const getTransactionsByType = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({ type: req.params.type });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};


// GET transactions by date range
export const getTransactionsByDate = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await Transaction.find({
      transactionDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};


// POST create new transaction
export const createTransaction = async (req: Request, res: Response) => {
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
};


// PUT update transaction by ID
export const editTransactionById = async (req: Request, res: Response) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
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
};


// DELETE transaction by ID
// router.delete("/id/:id", async (req: Request, res: Response) => {
//   try {
//     const deletedTransaction = await Transaction.findByIdAndDelete(
//       req.params.id,
//     );
//     if (!deletedTransaction) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }
//     res.json({
//       message: "Transaction deleted successfully",
//       transaction: deletedTransaction,
//     });
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     res.status(500).json({ error: "Error deleting transaction" });
//   }
// });

export const deleteTransactionById = async (req: Request, res: Response) => {
  try {
    const base = await Transaction.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Transaction not found" });

    if (base.isBetweenTwoPerson && base.pairGroupId) {
      await Transaction.deleteMany({ pairGroupId: base.pairGroupId });
      return res.json({ message: "Both paired transactions deleted" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({
      message: "Transaction deleted successfully",
      transaction: base,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Error deleting transaction" });
  }
};

export default router;
