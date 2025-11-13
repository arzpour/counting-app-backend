const Transaction = require("../models/transaction");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const data = await Transaction.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;
  try {
    const transactions = await Transaction.find({ ChassisNo: chassisNo });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/investment/:chassisNo", async (req, res) => {
  try {
    const { chassisNo } = req.params;
    const data = await Transaction.find({
      TransactionType: "افزایش سرمایه",
      ChassisNo: chassisNo,
    });
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res
      .status(500)
      .json({ error: "Error creating transaction", details: error.message });
  }
});

module.exports = router;
