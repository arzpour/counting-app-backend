import { Types } from "mongoose";

export interface ITransaction {
  _id: Types.ObjectId;
  amount: number;
  transactionDate: string;
  type: string;
  reason: string;
  paymentMethod: string;
  personId: string;
  dealId: string;
  bussinessAccountId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
