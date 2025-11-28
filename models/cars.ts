import mongoose, { Document, Schema } from "mongoose";

export interface ICar extends Document {
  RowNo?: number;
  CarModel?: string;
  SaleAmount?: number;
  PurchaseAmount?: number;
  LicensePlate?: string;
  ChassisNo?: string;
  SellerName?: string;
  BuyerName?: string;
  SaleDate?: string;
  PurchaseDate?: string;
  SellerMobile?: string;
  BuyerMobile?: string;
  PurchaseBroker?: string;
  SaleBroker?: string;
  Secretary?: string;
  DocumentsCopy?: string;
  SellerNationalID?: string;
  BuyerNationalID?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const carSchema = new Schema<ICar>(
  {
    RowNo: Number,
    CarModel: String,
    SaleAmount: Number,
    PurchaseAmount: Number,
    LicensePlate: String,
    ChassisNo: String,
    SellerName: String,
    BuyerName: String,
    SaleDate: String,
    PurchaseDate: String,
    SellerMobile: String,
    BuyerMobile: String,
    PurchaseBroker: String,
    SaleBroker: String,
    Secretary: String,
    DocumentsCopy: String,
    SellerNationalID: String,
    BuyerNationalID: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Car = mongoose.model<ICar>("Car", carSchema, "data");
export default Car;

