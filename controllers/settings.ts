import { Request, Response } from "express";
import Setting from "../models/data-settings";

// Get all categories and their options
export const getAllSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get one category (e.g., transactionWays)
export const getSettingByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const setting = await Setting.findOne({ category: req.params.category });
    if (!setting) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(setting);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Add option to category
export const addOption = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.params;
  const { option } = req.body;

  try {
    const setting = await Setting.findOne({ category });
    if (!setting) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (!setting.options.includes(option)) setting.options.push(option);
    await setting.save();

    res.json(setting);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete option from category
export const deleteOption = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.params;
  const { option } = req.body;

  try {
    const setting = await Setting.findOne({ category });
    if (!setting) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    setting.options = setting.options.filter((opt) => opt !== option);
    await setting.save();

    res.json(setting);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create new category
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category, options } = req.body;
  try {
    const newSetting = new Setting({ category, options });
    await newSetting.save();
    res.status(201).json(newSetting);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

