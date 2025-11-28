import { Types } from "mongoose";

export interface IDeal {
  _id: Types.ObjectId;
  vehicleId: number;
  vehicleSnapshot: {
    vin: string;
    model: string;
    productionYear: number;
    plateNumber: string;
  };
  status: string;
  purchaseDate: string;
  purchasePrice: number;
  saleDate: string;
  salePrice: number;
  seller: {
    personId: string;
    fullName: string;
    nationalId: string;
    mobile: string;
  };
  buyer: {
    personId: string;
    fullName: string;
    nationalId: string;
    mobile: string;
  };
  purchaseBroker: {
    personId: string;
    fullName: string;
    commissionPercent: number;
    commissionAmount: number;
  };
  saleBroker: {
    personId: string;
    fullName: string;
    commissionPercent: number;
    commissionAmount: number;
  };
  commissionPercent: number;
  commissionAmount: number;
  directCosts: {
    options: {
      id: string;
      provider: {
        personId: string;
        name: string;
      };
      date: string;
      description: string;
      cost: number;
    }[];
    otherCost: {
      id: string;
      category: string;
      description: string;
      cost: number;
    }[];
  };
  partnerships: {
    partner: {
      personId: string;
      name: string;
      nationalID: string;
      mobile: string;
    };
    investmentAmount: number;
    profitSharePercentage: number;
    payoutAmount: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
