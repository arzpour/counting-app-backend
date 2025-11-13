const mongoose = require("mongoose");

const chequeSchema = new mongoose.Schema(
  {
    CarChassisNo: { type: Number },
    CustomerName: String,
    CustomerNationalID: String,
    AccountHolderName: String,
    AccountHolderNationalID: String,
    ChequeSeries: String,
    ChequeSerial: Number,
    SayadiID: String,
    ChequeAmount: Number,
    ChequeDueDate: String,
    ChequeRegisterDate: String,
    LastActionDate: String,
    LastAction: String,
    ChequeStatus: String,
    ChequeType: String,
    ChequeNotes: String,
    CirculationStage: String,
    Bank: String,
    Branch: String,
    PrevChequeNo: Number,
    ShowroomAccountCard: String,
  },
  { timestamps: true }
);

const Cheque = mongoose.model("Cheque", chequeSchema, "cheque");

module.exports = Cheque;
