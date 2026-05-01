import { Document, Schema } from "mongoose";
import { IExpense } from "../types/expenses";

export interface IExpenseDoc extends Document, Omit<IExpense, "_id"> {}

const expenseSchema = new Schema<IExpenseDoc>(
  {
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    expenseDate: { type: String, required: true },
    description: { type: String },
    recipientPersonId: { type: String },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  },
);

export function getExpenseModel(db: any) {
  if (!db) return null;
  if (db.models?.Expense) return db.models.Expense;
  return db.model("Expense", expenseSchema);
}

// const Expense = mongoose.model<IExpenseDoc>(
//   "Expense",
//   expenseSchema,
//   "expenses"
// );
// export default Expense;
