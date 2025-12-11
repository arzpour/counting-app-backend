import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user";

dotenv.config();

async function createUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "importDB",
    });
    console.log("✅ Connected to MongoDB");

    // Delete existing user if exists
    await User.deleteOne({ username: "user1" });
    console.log("🗑️  Deleted existing user1 (if existed)");

    // Create new user - password will be automatically hashed by the pre-save hook
    const newUser = new User({
      username: "user1",
      password: "123321",
      firstname: "user1",
      lastname: "userlastname",
      role: "accountant",
    });

    await newUser.save();
    console.log("✅ User created successfully with hashed password!");
    console.log("Username:", newUser.username);
    console.log("Role:", newUser.role);

    // Verify the password was hashed
    const savedUser = await User.findOne({ username: "user1" }).select(
      "+password"
    );
    console.log("🔒 Password is hashed:", savedUser?.password.startsWith("$2"));

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createUser();
