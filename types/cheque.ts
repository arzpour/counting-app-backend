import { Types } from "mongoose";

export interface ICheque {
  _id: Types.ObjectId;
  chequeNumber: number;
  bankName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  type: string;
  status: string;
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
  relatedDealId: number;
  relatedTransactionId: number;
  actions: {
    actionType: string;
    actionDate: string;
    actorUserId: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
