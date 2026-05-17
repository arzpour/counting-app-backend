import { Response } from "express";
import { getSettingModel } from "../models/setting";
import { AuthRequest } from "../types/db";

// Get all categories and their options
export const getAllSettings = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const SettingModel = getSettingModel(req.db);
    if (!SettingModel) {
      res.status(500).json({ error: "Setting model is not initialized" });
      return;
    }
    const settings = await SettingModel.find();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get one category (e.g., transactionWays)
export const getSettingByCategory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const SettingModel = getSettingModel(req.db);
    if (!SettingModel) {
      res.status(500).json({ error: "Setting model is not initialized" });
      return;
    }
    const setting = await SettingModel.findOne({
      category: req.params.category,
    });
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
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { category } = req.params;
  const { option } = req.body;

  try {
    const SettingModel = getSettingModel(req.db);
    if (!SettingModel) {
      res.status(500).json({ error: "Setting model is not initialized" });
      return;
    }
    const setting = await SettingModel.findOne({ category });
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
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { category } = req.params;
  const { option } = req.body;

  try {
    const SettingModel = getSettingModel(req.db);
    if (!SettingModel) {
      res.status(500).json({ error: "Setting model is not initialized" });
      return;
    }
    const setting = await SettingModel.findOne({ category });
    if (!setting) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    setting.options = setting.options.filter((opt: string) => opt !== option);
    await setting.save();

    res.json(setting);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create new category
export const createCategory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { category, options } = req.body;
  try {
    const SettingModel = getSettingModel(req.db);
    if (!SettingModel) {
      res.status(500).json({ error: "Setting model is not initialized" });
      return;
    }
    const newSetting = new SettingModel({ category, options });
    await newSetting.save();
    res.status(201).json(newSetting);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
