import { Types } from "mongoose";

export interface ILoan {
  _id: Types.ObjectId;
  borrower: {
    personId: string;
    fullName: string;
    nationalId: string;
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
    relatedSalaryPaymentId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
