import { Types } from "mongoose";

export interface IPeople {
  _id: Types.ObjectId;
  fullName: string;
  nationalId: number;
  phoneNumber: number;
  address: string;
  roles: string[];
  brokerDetails: {
    currentRates: {
      purchaseCommissionPercent: string;
      saleCommissionPercent: string;
      lastUpdated: string;
    };
    rateHistory: {
      effectiveDate: string;
      purchaseCommissionPercent: string;
      saleCommissionPercent: string;
    }[];
  };
  employmentDetails: {
    startDate: string;
    contractType: string;
    baseSalary: number;
  };
  wallet: {
    balance: number;
    transactions: {
      amount: number;
      type: string;
      description: string;
      date: string;
    }[];
  };
}
