import mongoose, { Document, Schema } from "mongoose";
import { IExpense } from "../types/expenses";

export interface IExpenseDoc extends Document, Omit<IExpense, "_id"> {}

const expenseSchema = new Schema<IExpenseDoc>(
  {
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    expenseDate: { type: String, required: true },
    description: { type: String },
    recipientPersonId: { type: String },
    transactionId: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model<IExpenseDoc>(
  "Expense",
  expenseSchema,
  "expenses"
);
export default Expense;
