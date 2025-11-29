import mongoose, { Document, Schema } from "mongoose";
import { ICheque } from "../types/cheque";

export interface IChequeDoc extends Document, Omit<ICheque, "_id"> {}

const chequeSchema = new Schema<IChequeDoc>(
  {
    chequeNumber: { type: Number, required: true },
    bankName: { type: String, required: true },
    issueDate: { type: String },
    dueDate: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    payer: {
      personId: { type: String },
      fullName: { type: String },
      nationalId: { type: String },
    },
    payee: {
      personId: { type: String },
      fullName: { type: String },
      nationalId: { type: String },
    },
    relatedDealId: { type: Number },
    relatedTransactionId: { type: Number },
    actions: [
      {
        actionType: { type: String },
        actionDate: { type: String },
        actorUserId: { type: String },
        description: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cheque = mongoose.model<IChequeDoc>("Cheque", chequeSchema, "cheques");
export default Cheque;
