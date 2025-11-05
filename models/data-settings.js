const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  options: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Setting", settingsSchema);