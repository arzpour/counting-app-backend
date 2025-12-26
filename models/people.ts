import mongoose, { Document, Schema } from "mongoose";
import { IPeople } from "../types/people";

export interface IPeopleDoc extends Document, Omit<IPeople, "_id"> {}

const peopleSchema = new Schema<IPeopleDoc>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String },
    idNumber: { type: String },
    nationalId: { type: Number, required: true, unique: true },
    phoneNumbers: [{ type: Number }],
    address: { type: String },
    roles: [{ type: String }],
    brokerDetails: {
      currentRates: {
        purchaseCommissionPercent: { type: String },
        saleCommissionPercent: { type: String },
        lastUpdated: { type: String },
      },
      rateHistory: [
        {
          effectiveDate: { type: String },
          purchaseCommissionPercent: { type: String },
          saleCommissionPercent: { type: String },
        },
      ],
    },
    employmentDetails: {
      startDate: { type: String },
      contractType: { type: String },
      baseSalary: { type: Number },
    },
    wallet: {
      balance: { type: Number, default: 0 },
      transactions: [
        {
          amount: { type: Number },
          type: { type: String },
          description: { type: String },
          date: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const People = mongoose.model<IPeopleDoc>("People", peopleSchema, "people");
export default People;
