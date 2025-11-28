import { Types } from "mongoose";

export interface ISalaries {
  _id: Types.ObjectId;
  employee: {
    personId: number;
    fullName: string;
    nationalId: number;
  };
  paymentDate: string;
  forYear: number;
  forMonth: number;
  baseSalary: number;
  overtimePay: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  relatedTransactionId: number;
  deductions: {
    insurance: number;
    tax: number;
    loanInstallments: {
      loanId: number;
      installmentNumber: number;
      amount: number;
    }[];
    otherDeductions: {
      description: string;
      amount: number;
    }[];
  };
  bonuses: {
    amount: number;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
