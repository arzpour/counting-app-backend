import mongoose, { Schema } from "mongoose";

type VehicleStatus = "sold" | "in_stock";

interface IVehicleDoc {
  vin: string;
  model: string;
  productionYear: number;
  plateNumber?: string;
  color?: string;
  status: VehicleStatus;
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
    vin: { type: String, required: true },
    model: { type: String, required: true },
    productionYear: { type: Number, required: true },
    plateNumber: { type: String, required: true, unique: true },
    color: { type: String },
    status: { type: String, enum: ["sold", "in_stock"] as const },
    dealHistoryIds: [{ type: String }],
    SecretaryName: { type: String },
    Secretary: { type: String },
    DocumentsCopy: { type: [String] },
    documents: { type: String, enum: ["ناقص", "کامل", "فاقد مدارک"] },
  },
  {
    timestamps: true,
  },
);

const Vehicle = mongoose.model<IVehicleDoc>(
  "Vehicle",
  vehicleSchema,
  "vehicles",
);
export default Vehicle;
