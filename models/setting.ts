import { Document, Schema } from "mongoose";

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

export function getSettingModel(db: any) {
  if (!db) return null;
  if (db.models?.Setting) return db.models.Setting;
  return db.model("Setting", settingsSchema);
}

// const Setting = mongoose.model<IDataSettings>("Setting", settingsSchema, "setting");
// export default Setting;
