import { Types } from "mongoose";

export interface ITransaction {
  _id: Types.ObjectId;
  amount: number;
  transactionDate: string;
  type: string;
  reason: string;
  paymentMethod: string;
  personId: string;
  secondPersonId: string;
  secondDealId: string;
  dealId: string;
  vin: string;
  secondVin: string;
  bussinessAccountId: string;
  description: string;
  providerPersonId: string;
  brokerPersonId: string;
  partnerPersonId: string;
  partnerShipProfit: string;
  partnershipProfitSharePercentage: string;
  isBetweenTwoPerson?: boolean;
  pairGroupId?: string;
  profitState?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}
