import { Types } from "mongoose";

export interface IExpense {
  _id: Types.ObjectId;
  category: string;
  amount: number;
  expenseDate: string;
  description: string;
  recipientPersonId: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}
