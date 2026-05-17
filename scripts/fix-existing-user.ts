// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import User from "../models/user";
// import bcrypt from "bcryptjs";

// dotenv.config();

// async function fixExistingUser() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URI as string, {
//       dbName: "importDB",
//     });
//     console.log("✅ Connected to MongoDB");

//     // Find the user
//     const user = await User.findOne({ username: "user1" }).select("+password");

//     if (!user) {
//       console.log("❌ User not found");
//       process.exit(1);
//     }

//     console.log("📍 Found user:", user.username);
//     console.log("🔍 Current password:", user.password);

//     // Check if password is already hashed
//     if (user.password.startsWith("$2")) {
//       console.log("✅ Password is already hashed!");
//     } else {
//       console.log("⚠️  Password is plain text, hashing it now...");

//       // Hash the plain text password
//       const hashedPassword = await bcrypt.hash("123321", 10);
//       user.password = hashedPassword;

//       // Save without triggering the pre-save hook (since we already hashed it)
//       await User.updateOne(
//         { _id: user._id },
//         { $set: { password: hashedPassword } }
//       );

//       console.log("✅ Password updated and hashed!");
//       console.log("🔒 New hashed password:", hashedPassword);
//     }

//     await mongoose.disconnect();
//     console.log("👋 Disconnected from MongoDB");
//   } catch (error) {
//     console.error("❌ Error:", error);
//     process.exit(1);
//   }
// }

// fixExistingUser();
