import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRouters from "./routers/api-router";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI as string, {
    dbName: "importDB",
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err: Error) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api", apiRouters);

app.listen(process.env.PORT, process.env.HOST as string, () => {
  console.log(
    `🚀 Server running on port ${process.env.PORT} host ${process.env.HOST}`
  );
});


