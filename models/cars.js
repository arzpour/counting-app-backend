const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    RowNo: Number,
    CarModel: String,
    SaleAmount: Number,
    PurchaseAmount: Number,
    LicensePlate: String,
    ChassisNo: String,
    SellerName: String,
    BuyerName: String,
    SaleDate: String,
    PurchaseDate: String,
    SellerMobile: String,
    BuyerMobile: String,
    PurchaseBroker: String,
    SaleBroker: String,
    Secretary: String,
    DocumentsCopy: String,
    SellerNationalID: String,
    BuyerNationalID: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Car = mongoose.model("Car", carSchema, "data");

module.exports = Car;
