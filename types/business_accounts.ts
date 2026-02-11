import { Types } from "mongoose";

export interface IBusinessAccounts {
  _id?: Types.ObjectId;
  accountName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  iban: string;
  cardNumber: string;
  isActive: boolean;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}
