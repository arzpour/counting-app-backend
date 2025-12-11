import mongoose, { Document, Schema } from "mongoose";
import { IDeal } from "../types/deals";

export interface IDealDoc extends Document, Omit<IDeal, "_id"> {}

const dealSchema = new Schema<IDealDoc>(
  {
    vehicleId: { type: Number, required: true },
    vehicleSnapshot: {
      vin: { type: String, required: true },
      model: { type: String, required: true },
      productionYear: { type: Number, required: true },
      plateNumber: { type: String },
    },
    status: { type: String, required: true },
    purchaseDate: { type: String },
    purchasePrice: { type: Number },
    saleDate: { type: String },
    salePrice: { type: Number },
    seller: {
      personId: { type: String },
      fullName: { type: String },
      nationalId: { type: String },
      mobile: { type: String },
    },
    buyer: {
      personId: { type: String },
      fullName: { type: String },
      nationalId: { type: String },
      mobile: { type: String },
    },
    purchaseBroker: {
      personId: { type: String },
      fullName: { type: String },
      commissionPercent: { type: Number },
      commissionAmount: { type: Number },
    },
    saleBroker: {
      personId: { type: String },
      fullName: { type: String },
      commissionPercent: { type: Number },
      commissionAmount: { type: Number },
    },
    commissionPercent: { type: Number },
    commissionAmount: { type: Number },
    directCosts: {
      options: [
        {
          id: { type: String },
          provider: {
            personId: { type: String },
            name: { type: String },
          },
          date: { type: String },
          description: { type: String },
          cost: { type: Number },
        },
      ],
      otherCost: [
        {
          id: { type: String },
          category: { type: String },
          description: { type: String },
          cost: { type: Number },
        },
      ],
    },
    partnerships: [
      {
        partner: {
          personId: { type: String },
          name: { type: String },
          nationalID: { type: String },
          mobile: { type: String },
        },
        investmentAmount: { type: Number },
        profitSharePercentage: { type: Number },
        payoutAmount: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model<IDealDoc>("Deal", dealSchema, "deals");
export default Deal;
