import express, { Response, Router } from "express";
import { getSalariesModel } from "../models/salaries";
import { AuthRequest } from "../types/db";

const router: Router = express.Router();

// GET all salaries
export const getAllSalaries = async (req: AuthRequest, res: Response) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const salaries = await SalariesModel.find();
    res.json(salaries);
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({ error: "Error fetching salaries" });
  }
};

// GET salary by ID
export const getSalarieById = async (req: AuthRequest, res: Response) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const salary = await SalariesModel.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ error: "Salary record not found" });
    }
    res.json(salary);
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ error: "Error fetching salary" });
  }
};

// GET salaries by employee person ID
export const getSalariesByPersonId = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const salaries = await SalariesModel.find({
      "employee.personId": req.params.personId,
    });
    res.json(salaries);
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({ error: "Error fetching salaries" });
  }
};

// GET salaries by year and month
export const getSalariesByDate = async (req: AuthRequest, res: Response) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const salaries = await SalariesModel.find({
      forYear: parseInt(req.params.year),
      forMonth: parseInt(req.params.month),
    });
    res.json(salaries);
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({ error: "Error fetching salaries" });
  }
};

// GET salaries by year
export const getSalariesByYear = async (req: AuthRequest, res: Response) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const salaries = await SalariesModel.find({
      forYear: parseInt(req.params.year),
    });
    res.json(salaries);
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res.status(500).json({ error: "Error fetching salaries" });
  }
};

// POST create new salary record
export const createSalary = async (req: AuthRequest, res: Response) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const newSalary = new SalariesModel(req.body);
    const savedSalary = await newSalary.save();
    res.status(201).json(savedSalary);
  } catch (error: any) {
    console.error("Error creating salary:", error);
    res.status(500).json({
      error: "Error creating salary",
      details: error.message,
    });
  }
};

// PUT update salary by ID
export const editSalaryById = async (req: AuthRequest, res: Response) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const updatedSalary = await SalariesModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedSalary) {
      return res.status(404).json({ error: "Salary record not found" });
    }
    res.json(updatedSalary);
  } catch (error: any) {
    console.error("Error updating salary:", error);
    res.status(500).json({
      error: "Error updating salary",
      details: error.message,
    });
  }
};

// DELETE salary by ID
export const deleteSalaryById = async (req: AuthRequest, res: Response) => {
  try {
    const SalariesModel = getSalariesModel(req.db);
    if (!SalariesModel) {
      res.status(500).json({ error: "Salaries model is not initialized" });
      return;
    }
    const deletedSalary = await SalariesModel.findByIdAndDelete(req.params.id);
    if (!deletedSalary) {
      return res.status(404).json({ error: "Salary record not found" });
    }
    res.json({
      message: "Salary record deleted successfully",
      salary: deletedSalary,
    });
  } catch (error) {
    console.error("Error deleting salary:", error);
    res.status(500).json({ error: "Error deleting salary" });
  }
};

export default router;
