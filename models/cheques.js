const mongoose = require("mongoose");

const chequeSchema = new mongoose.Schema({
  CarChassisNo: { type: Number },
  ChequeSerial: String,
  SayadiID: String,
  ChequeAmount: Number,
  ChequeDueDate: String,
  ChequeStatus: String,
  ChequeType: String,
  CirculationStage: String,
});

const Cheque = mongoose.model("Cheque", chequeSchema, "cheque");

module.exports = Cheque;
