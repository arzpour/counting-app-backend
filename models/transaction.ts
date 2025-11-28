import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  ChassisNo?: string;
  TransactionType?: string;
  TransactionReason?: string;
  TransactionMethod?: string;
  ShowroomCard?: string;
  CustomerNationalID?: string;
  TransactionAmount?: number;
  TransactionDate?: string;
  Notes?: string;
  BankDocument?: string;
  Partner?: string;
  Broker?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
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

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema,
  "ransaction"
);
export default Transaction;

