const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({}, { strict: false });

const Settings = mongoose.model("Settings", SettingsSchema, "settings");

module.exports = Settings;
