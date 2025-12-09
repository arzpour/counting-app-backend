import mongoose, { Schema } from "mongoose";

interface IVehicleDoc {
  vin: string;
  model: string;
  productionYear: number;
  plateNumber?: string;
  color?: string;
  dealHistoryIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

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

