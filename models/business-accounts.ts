import  { Document, Schema } from "mongoose";
import { IBusinessAccounts } from "../types/business_accounts";

export interface IBusinessAccountsDoc extends Document, Omit<IBusinessAccounts, "_id"> {}

const businessAccountsSchema = new Schema<IBusinessAccountsDoc>(
  {
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String },
    accountNumber: { type: String, required: true, unique: true },
    iban: { type: String },
    cardNumber: { type: String },
    isActive: { type: Boolean, default: true },
    currentBalance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);


export function getBusinessAccountsModel(db: any) {
  if (!db) return null;
  if (db.models?.BusinessAccounts) return db.models.BusinessAccounts;
  return db.model("BusinessAccounts", businessAccountsSchema);
}

// const BusinessAccounts = mongoose.model<IBusinessAccountsDoc>(
//   "BusinessAccounts",
//   businessAccountsSchema,
//   "business_accounts"
// );
// export default BusinessAccounts;
