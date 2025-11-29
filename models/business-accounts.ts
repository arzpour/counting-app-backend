import mongoose, { Document, Schema } from "mongoose";
import { IBusinessAccounts } from "../types/business_accounts";

export interface IBusinessAccountsDoc extends Document, Omit<IBusinessAccounts, "_id"> {}

const businessAccountsSchema = new Schema<IBusinessAccountsDoc>(
  {
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String },
    accountNumber: { type: Number, required: true, unique: true },
    iban: { type: String },
    cardNumber: { type: String },
    isActive: { type: Boolean, default: true },
    currentBalance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const BusinessAccounts = mongoose.model<IBusinessAccountsDoc>(
  "BusinessAccounts",
  businessAccountsSchema,
  "business_accounts"
);
export default BusinessAccounts;

