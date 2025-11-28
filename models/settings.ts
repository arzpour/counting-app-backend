import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  [key: string]: any;
}

const SettingsSchema = new Schema<ISettings>({}, { strict: false });

const Settings = mongoose.model<ISettings>("Settings", SettingsSchema, "settings");
export default Settings;

