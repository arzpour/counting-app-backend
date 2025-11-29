import mongoose, { Document, Schema } from "mongoose";
import { ITransaction } from "../types/transaction";

export interface ITransactionDoc extends Document, Omit<ITransaction, "_id"> {}

const transactionSchema = new Schema<ITransactionDoc>(
  {
    amount: { type: Number, required: true },
    transactionDate: { type: String, required: true },
    type: { type: String, required: true },
    reason: { type: String },
    paymentMethod: { type: String, required: true },
    personId: { type: String },
    dealId: { type: String },
    bussinessAccountId: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransactionDoc>(
  "Transaction",
  transactionSchema,
  "transactions"
);
export default Transaction;

