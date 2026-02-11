import { Types } from "mongoose";

export interface ICheque {
  _id: Types.ObjectId;
  chequeNumber: number;
  chequeSerial: string;
  bankName: string;
  branchName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  type: string;
  status: string;
  vin: string;
  description: string;
  customer: {
    personId: string;
    fullName: string;
    nationalId: string;
  };
  payer: {
    personId: string;
    fullName: string;
    nationalId: string;
  };
  payee: {
    personId: string;
    fullName: string;
    nationalId: string;
  };
  relatedDealId: string;
  relatedTransactionId: string;
  sayadiID: string;
  actions: {
    actionType: string;
    actionDate: string;
    actorUserId: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
