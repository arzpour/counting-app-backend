import mongoose, { Document, Schema } from "mongoose";

export interface ICheque extends Document {
  CarChassisNo?: number | string;
  CustomerName?: string;
  CustomerNationalID?: string;
  AccountHolderName?: string;
  AccountHolderNationalID?: string;
  ChequeSeries?: string;
  ChequeSerial?: number;
  SayadiID?: string;
  ChequeAmount?: number;
  ChequeDueDate?: string;
  ChequeRegisterDate?: string;
  LastActionDate?: string;
  LastAction?: string;
  ChequeStatus?: string;
  ChequeType?: string;
  ChequeNotes?: string;
  CirculationStage?: string;
  Bank?: string;
  Branch?: string;
  PrevChequeNo?: number;
  ShowroomAccountCard?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const chequeSchema = new Schema<ICheque>(
  {
    CarChassisNo: { type: Schema.Types.Mixed },
    CustomerName: String,
    CustomerNationalID: String,
    AccountHolderName: String,
    AccountHolderNationalID: String,
    ChequeSeries: String,
    ChequeSerial: Number,
    SayadiID: String,
    ChequeAmount: Number,
    ChequeDueDate: String,
    ChequeRegisterDate: String,
    LastActionDate: String,
    LastAction: String,
    ChequeStatus: String,
    ChequeType: String,
    ChequeNotes: String,
    CirculationStage: String,
    Bank: String,
    Branch: String,
    PrevChequeNo: Number,
    ShowroomAccountCard: String,
  },
  { timestamps: true }
);

const Cheque = mongoose.model<ICheque>("Cheque", chequeSchema, "cheque");
export default Cheque;

