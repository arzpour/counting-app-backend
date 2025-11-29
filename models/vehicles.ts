import mongoose, { Document, Schema } from "mongoose";
import { IVehicle } from "../types/vehicles";

export interface IVehicleDoc extends Document, Omit<IVehicle, "_id"> {}

const vehicleSchema = new Schema<IVehicleDoc>(
  {
    vin: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    productionYear: { type: Number, required: true },
    plateNumber: { type: String },
    color: { type: String },
    dealHistoryIds: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model<IVehicleDoc>("Vehicle", vehicleSchema, "vehicles");
export default Vehicle;

