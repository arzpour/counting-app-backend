import mongoose, { Document, Schema } from "mongoose";
import { ILoan } from "../types/loans";

export interface ILoanDoc extends Document, Omit<ILoan, "_id"> {}

const loanSchema = new Schema<ILoanDoc>(
  {
    borrower: {
      personId: { type: String, required: true },
      fullName: { type: String, required: true },
      nationalId: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    loanDate: { type: String, required: true },
    numberOfInstallments: { type: Number, required: true },
    installmentAmount: { type: Number, required: true },
    status: { type: String, required: true },
    description: { type: String },
    installments: [
      {
        installmentNumber: { type: Number, required: true },
        dueDate: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { type: String, required: true },
        paymentDate: { type: String },
        relatedSalaryPaymentId: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Loan = mongoose.model<ILoanDoc>("Loan", loanSchema, "loans");
export default Loan;
