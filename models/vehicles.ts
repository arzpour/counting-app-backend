import mongoose, { Schema } from "mongoose";

interface IVehicleDoc {
  vin: string;
  model: string;
  productionYear: number;
  plateNumber?: string;
  color?: string;
  dealHistoryIds?: string[];
  SecretaryName?: string;
  Secretary?: string;
  DocumentsCopy?: string[];
  documents?: "ناقص" | "کامل" | "فاقد مدارک";
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
    SecretaryName: { type: String },
    Secretary: { type: String },
    DocumentsCopy: { type: [String] },
    documents: { type: String, enum: ["ناقص", "کامل", "فاقد مدارک"] },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model<IVehicleDoc>("Vehicle", vehicleSchema, "vehicles");
export default Vehicle;

