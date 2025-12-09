import mongoose, { Document, Schema } from "mongoose";
import { ISalaries } from "../types/salaries";

export interface ISalariesDoc extends Document, Omit<ISalaries, "_id"> {}

const salariesSchema = new Schema<ISalariesDoc>(
  {
    employee: {
      personId: { type: String, required: true },
      fullName: { type: String, required: true },
      nationalId: { type: String, required: true },
    },
    paymentDate: { type: String, required: true },
    forYear: { type: Number, required: true },
    forMonth: { type: Number, required: true },
    baseSalary: { type: Number, required: true },
    overtimePay: { type: Number, default: 0 },
    grossPay: { type: Number, required: true },
    totalDeductions: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    relatedTransactionId: { type: String },
    deductions: {
      insurance: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      loanInstallments: [
        {
          loanId: { type: String },
          installmentNumber: { type: Number },
          amount: { type: Number },
        },
      ],
      otherDeductions: [
        {
          description: { type: String },
          amount: { type: Number },
        },
      ],
    },
    bonuses: [
      {
        amount: { type: Number },
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Salaries = mongoose.model<ISalariesDoc>("Salaries", salariesSchema, "salaries");
export default Salaries;

