import { Types } from "mongoose";

export interface ILoan {
  _id: Types.ObjectId;
  borrower: {
    personId: number;
    fullName: string;
    nationalId: number;
  };
  totalAmount: number;
  loanDate: string;
  numberOfInstallments: number;
  installmentAmount: number;
  status: string;
  description: string;
  installments: {
    installmentNumber: number;
    dueDate: string;
    amount: number;
    status: string;
    paymentDate: string;
    relatedSalaryPaymentId: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
