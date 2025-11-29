import express, { Request, Response, Router } from "express";
import Loan from "../models/loans";

const router: Router = express.Router();

// GET all loans
router.get("/", async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find();
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Error fetching loans" });
  }
});

// GET loan by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(loan);
  } catch (error) {
    console.error("Error fetching loan:", error);
    res.status(500).json({ error: "Error fetching loan" });
  }
});

// GET loans by borrower person ID
router.get("/borrower/:personId", async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find({ "borrower.personId": req.params.personId });
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Error fetching loans" });
  }
});

// GET loans by status
router.get("/status/:status", async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find({ status: req.params.status });
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Error fetching loans" });
  }
});

// POST create new loan
router.post("/", async (req: Request, res: Response) => {
  try {
    const newLoan = new Loan(req.body);
    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (error: any) {
    console.error("Error creating loan:", error);
    res.status(500).json({ 
      error: "Error creating loan", 
      details: error.message 
    });
  }
});

// PUT update loan by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(updatedLoan);
  } catch (error: any) {
    console.error("Error updating loan:", error);
    res.status(500).json({ 
      error: "Error updating loan", 
      details: error.message 
    });
  }
});

// PUT update installment status
router.put("/id/:id/installment/:installmentNumber", async (req: Request, res: Response) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    const installmentNumber = parseInt(req.params.installmentNumber);
    const installment = loan.installments?.find(
      (inst) => inst.installmentNumber === installmentNumber
    );

    if (!installment) {
      return res.status(404).json({ error: "Installment not found" });
    }

    Object.assign(installment, req.body);
    await loan.save();

    res.json(loan);
  } catch (error: any) {
    console.error("Error updating installment:", error);
    res.status(500).json({ 
      error: "Error updating installment", 
      details: error.message 
    });
  }
});

// DELETE loan by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
    if (!deletedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json({ 
      message: "Loan deleted successfully", 
      loan: deletedLoan 
    });
  } catch (error) {
    console.error("Error deleting loan:", error);
    res.status(500).json({ error: "Error deleting loan" });
  }
});

export default router;

