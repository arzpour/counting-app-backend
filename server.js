require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRouters = require("./routers/api-router");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "importDB",
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api", apiRouters);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`🚀 Server running on port ${process.env.PORT} host ${process.env.HOST}`);
});
