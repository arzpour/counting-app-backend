import { Types } from "mongoose";

export interface IVehicle {
  _id: Types.ObjectId;
  vin: string;
  model: string;
  productionYear: number;
  plateNumber: string;
  color: string;
  dealHistoryIds: string[];
  createdAt: string;
  updatedAt: string;
}
