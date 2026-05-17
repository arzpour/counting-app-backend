import express, { Response, Router } from "express";
import { getLoanModel } from "../models/loans";
import { AuthRequest } from "../types/db";

const router: Router = express.Router();

// GET all loans
export const getAllLoans = async (req: AuthRequest, res: Response) => {
  try {
    const LoanModel = getLoanModel(req.db);
    if (!LoanModel) {
      return res.status(500).json({ error: "Loan model is not initialized" });
    }
    const loans = await LoanModel.find();
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Error fetching loans" });
  }
};

// GET loan by ID
export const getLoanById = async (req: AuthRequest, res: Response) => {
  try {
    const LoanModel = getLoanModel(req.db);
    if (!LoanModel) {
      return res.status(500).json({ error: "Loan model is not initialized" });
    }
    const loan = await LoanModel.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(loan);
  } catch (error) {
    console.error("Error fetching loan:", error);
    res.status(500).json({ error: "Error fetching loan" });
  }
};

// GET loans by borrower person ID
export const getLoansByPersonId = async (req: AuthRequest, res: Response) => {
  try {
    const LoanModel = getLoanModel(req.db);
    if (!LoanModel) {
      return res.status(500).json({ error: "Loan model is not initialized" });
    }
    const loans = await LoanModel.find({
      "borrower.personId": req.params.personId,
    });
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Error fetching loans" });
  }
};

// GET loans by status
export const getLoansByStatus = async (req: AuthRequest, res: Response) => {
  try {
    const LoanModel = getLoanModel(req.db);
    if (!LoanModel) {
      return res.status(500).json({ error: "Loan model is not initialized" });
    }
    const loans = await LoanModel.find({ status: req.params.status });
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Error fetching loans" });
  }
};

// POST create new loan
export const createLoan = async (req: AuthRequest, res: Response) => {
  try {
    const LoanModel = getLoanModel(req.db);
    if (!LoanModel) {
      return res.status(500).json({ error: "Loan model is not initialized" });
    }
    const newLoan = new LoanModel(req.body);
    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (error: any) {
    console.error("Error creating loan:", error);
    res.status(500).json({
      error: "Error creating loan",
      details: error.message,
    });
  }
};

// PUT update loan by ID
export const editLoanById = async (req: AuthRequest, res: Response) => {
  try {
    const LoanModel = getLoanModel(req.db);
    if (!LoanModel) {
      return res.status(500).json({ error: "Loan model is not initialized" });
    }
    const updatedLoan = await LoanModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(updatedLoan);
  } catch (error: any) {
    console.error("Error updating loan:", error);
    res.status(500).json({
      error: "Error updating loan",
      details: error.message,
    });
  }
};

// PUT update installment status
// router.put("/id/:id/installment/:installmentNumber", async (req: AuthRequest, res: Response) => {
//   try {
//     const loan = await Loan.findById(req.params.id);
//     if (!loan) {
//       return res.status(404).json({ error: "Loan not found" });
//     }

//     const installmentNumber = parseInt(req.params.installmentNumber);
//     const installment = loan.installments?.find(
//       (inst) => inst.installmentNumber === installmentNumber
//     );

//     if (!installment) {
//       return res.status(404).json({ error: "Installment not found" });
//     }

//     Object.assign(installment, req.body);
//     await loan.save();

//     res.json(loan);
//   } catch (error: any) {
//     console.error("Error updating installment:", error);
//     res.status(500).json({
//       error: "Error updating installment",
//       details: error.message
//     });
//   }
// });

// DELETE loan by ID
export const deleteLoanById = async (req: AuthRequest, res: Response) => {
  try {
    const LoanModel = getLoanModel(req.db);
    if (!LoanModel) {
      return res.status(500).json({ error: "Loan model is not initialized" });
    }
    const deletedLoan = await LoanModel.findByIdAndDelete(req.params.id);
    if (!deletedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json({
      message: "Loan deleted successfully",
      loan: deletedLoan,
    });
  } catch (error) {
    console.error("Error deleting loan:", error);
    res.status(500).json({ error: "Error deleting loan" });
  }
};

export default router;
