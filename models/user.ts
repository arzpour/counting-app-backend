import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: "accountant" | "secretary";
  firstname?: string;
  lastname?: string;
  comparePassword(userPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["accountant", "secretary"],
    default: "accountant",
  },
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
});

userSchema.pre("save", async function (next: any) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return typeof next === "function" ? next() : undefined;
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    return typeof next === "function" ? next() : undefined;
  } catch (error: any) {
    return typeof next === "function" ? next(error) : Promise.reject(error);
  }
});

// compare hash and plain password
userSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema, "users");
export default User;
