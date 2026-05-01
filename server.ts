import dotenv from "dotenv";
import express, { Express } from "express";
// import mongoose from "mongoose";
import cors from "cors";
import apiRouters from "./routers/api-router-new";
import { authenticateJWT } from "./middleware/auth";
import { attachDatabase } from "./db/connectToDB";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
// app.use(authenticateJWT); // First authenticate
// app.use(attachDatabase);
// mongoose
//   .connect(process.env.MONGO_URI as string, {
//     dbName: "importDB",
//   })
//   .then(() => {console.log("✅ Connected to MongoDB Atlas");
//     // Vehicle.dropIndexes()
//   })
//   .catch((err: Error) => console.error("❌ MongoDB Connection Error:", err));

// db.vehicles.dropIndexes()

app.use("/api", apiRouters);

app.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT} host ${HOST}`);
});
