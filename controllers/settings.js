const Settings = require("../models/data-settings");

// Get all categories and their options
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one category (e.g., transactionWays)
exports.getSettingByCategory = async (req, res) => {
  try {
    const setting = await Settings.findOne({ category: req.params.category });
    if (!setting) return res.status(404).json({ message: "Category not found" });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add option to category
exports.addOption = async (req, res) => {
  const { category } = req.params;
  const { option } = req.body;

  try {
    const setting = await Setting.findOne({ category });
    if (!setting) return res.status(404).json({ message: "Category not found" });

    if (!setting.options.includes(option)) setting.options.push(option);
    await setting.save();

    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete option from category
exports.deleteOption = async (req, res) => {
  const { category } = req.params;
  const { option } = req.body;

  try {
    const setting = await Setting.findOne({ category });
    if (!setting) return res.status(404).json({ message: "Category not found" });

    setting.options = setting.options.filter((opt) => opt !== option);
    await setting.save();

    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  const { category, options } = req.body;
  try {
    const newSetting = new Setting({ category, options });
    await newSetting.save();
    res.status(201).json(newSetting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
