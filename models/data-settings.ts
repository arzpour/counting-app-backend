import mongoose, { Document, Schema } from "mongoose";

export interface IDataSettings extends Document {
  category: string;
  options: string[];
}

const settingsSchema = new Schema<IDataSettings>({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  options: {
    type: [String],
    default: [],
  },
});

const Setting = mongoose.model<IDataSettings>("Setting", settingsSchema, "setting");
export default Setting;

