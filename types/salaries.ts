import { Types } from "mongoose";

export interface ISalaries {
  _id: Types.ObjectId;
  employee: {
    personId: string;
    fullName: string;
    nationalId: string;
  };
  paymentDate: string;
  forYear: number;
  forMonth: number;
  baseSalary: number;
  overtimePay: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  relatedTransactionId: string;
  deductions: {
    insurance: number;
    tax: number;
    loanInstallments: {
      loanId: string;
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
