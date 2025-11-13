const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    ChassisNo: String,
    TransactionType: String,
    TransactionReason: String,
    TransactionMethod: String,
    ShowroomCard: String,
    CustomerNationalID: String,
    TransactionAmount: Number,
    TransactionDate: String,
    Notes: String,
    BankDocument: String,
    Partner: String,
    Broker: Number,
  },
  { timestamps: true }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "ransaction"
);

module.exports = Transaction;
