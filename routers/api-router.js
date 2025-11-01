const Router = require("express");
const Cheque = require("../models/cheques");
const Transaction = require("../models/transaction");
const Car = require("../models/cars");

const router = Router();

router.get("/cheque", async (req, res) => {
  try {
    const data = await Cheque.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const data = await Transaction.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

router.get("/cars", async (req, res) => {
  try {
    const data = await Car.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

router.get("/cars/chassisNo", async (req, res) => {
  try {
    const cars = await Car.find({}, "ChassisNo");

    const chassisList = cars.map((car) => car.ChassisNo);

    res.json(chassisList);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

router.get("/cars/:chassisNo", async (req, res) => {
  const car = await Car.findOne({ ChassisNo: req.params.chassisNo });
  if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });
  res.json(car);
});

// GET /api/transactions/:chassisNo
router.get("/transactions/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;
  try {
    const transactions = await Transaction.find({ ChassisNo: chassisNo });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// GET /api/cheques/:chassisNo
router.get("/cheques/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;
  try {
    const cheques = await Cheque.find({ CarChassisNo: chassisNo });
    res.json(cheques);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

// GET /api/cars/:chassisNo/details
// router.get("/cars/:chassisNo/details", async (req, res) => {
//   const { chassisNo } = req.params;

//   try {
//     const car = await Car.findOne({ ChassisNo: chassisNo });
//     const cheques = await Cheque.find({ CarChassisNo: chassisNo });
//     const transactions = await Transaction.find({ ChassisNo: chassisNo });

//     if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });

//     res.json({
//       car,
//       cheques,
//       transactions,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching details" });
//   }
// });

// router.get("/cars/:chassisNo/details", async (req, res) => {
//   const { chassisNo } = req.params;

//   try {
//     const car = await Car.findOne({ ChassisNo: chassisNo });
//     if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });

//     // تبدیل به عدد (در صورتی که قابل تبدیل باشد)
//     const chassisNoAsNumber = Number(chassisNo);
//     const cheques = await Cheque.find({
//       $or: [
//         { CarChassisNo: chassisNoAsNumber }, // حالت عددی
//         { CarChassisNo: chassisNo }, // حالت متنی
//       ],
//     });

//     const transactions = await Transaction.find({
//       $or: [{ ChassisNo: chassisNo }, { ChassisNo: chassisNoAsNumber }],
//     });

//     res.json({ car, cheques, transactions });
//   } catch (err) {
//     console.error("Error fetching details:", err);
//     res.status(500).json({ error: "Error fetching details" });
//   }
// });

// router.get("/cars/:chassisNo/details", async (req, res) => {
//   const { chassisNo } = req.params;

//   try {
//     const car = await Car.findOne({ ChassisNo: chassisNo });
//     if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });

//     // تبدیل به عدد فقط در صورت قابل تبدیل بودن
//     const chassisNoAsNumber = !isNaN(Number(chassisNo)) ? Number(chassisNo) : null;

//     const cheques = await Cheque.find({
//       $or: [
//         { CarChassisNo: chassisNo },
//         ...(chassisNoAsNumber !== null ? [{ CarChassisNo: chassisNoAsNumber }] : []),
//       ],
//     });

//     const transactions = await Transaction.find({
//       $or: [
//         { ChassisNo: chassisNo },
//         ...(chassisNoAsNumber !== null ? [{ ChassisNo: chassisNoAsNumber }] : []),
//       ],
//     });

//     res.json({ car, cheques, transactions });
//   } catch (err) {
//     console.error("Error fetching details:", err);
//     res.status(500).json({ error: "Error fetching details" });
//   }
// });

router.get("/cars/:chassisNo/details", async (req, res) => {
  const { chassisNo } = req.params;

  try {
    const car = await Car.findOne({ ChassisNo: chassisNo });
    if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });

    // تبدیل به عدد فقط در صورت قابل تبدیل بودن
    const chassisNoAsNumber = !isNaN(Number(chassisNo))
      ? Number(chassisNo)
      : null;

    const cheques = await Cheque.find({
      $or: [
        { CarChassisNo: chassisNo },
        ...(chassisNoAsNumber !== null
          ? [{ CarChassisNo: chassisNoAsNumber }]
          : []),
      ],
    });

    const transactions = await Transaction.find({
      $or: [
        { ChassisNo: chassisNo },
        ...(chassisNoAsNumber !== null
          ? [{ ChassisNo: chassisNoAsNumber }]
          : []),
      ],
    });

    res.json({ car, cheques, transactions });
  } catch (err) {
    console.error("Error fetching details:", err);
    res.status(500).json({ error: "Error fetching details" });
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




// // ✅ GET /api/unpaid/:chassisNo
router.get("/unpaid/:chassisNo", async (req, res) => {
  const { chassisNo } = req.params;

  try {
    const chassisAsNumber = Number(chassisNo);

    // پیدا کردن چک‌ها با تطبیق رشته‌ای یا عددی
    const cheques = await Cheque.find({
      $or: [
        { CarChassisNo: chassisNo }, // رشته‌ای
        ...(isNaN(chassisAsNumber)
          ? []
          : [{ $expr: { $eq: [{ $toInt: "$CarChassisNo" }, chassisAsNumber] } }]), // int32
      ],
    });

    if (!cheques.length) {
      return res
        .status(404)
        .json({ message: "هیچ چکی برای این شاسی یافت نشد" });
    }

    // جدا کردن چک‌های صادره و وارده وصول‌نشده
    const issuedUnpaid = cheques.filter(
      (c) => c.ChequeType === "صادره" && c.ChequeStatus !== "وصول شد"
    );
    const receivedUnpaid = cheques.filter(
      (c) => c.ChequeType === "وارده" && c.ChequeStatus !== "وصول شد"
    );

    // جمع مبالغ
    const totalIssuedUnpaid = issuedUnpaid.reduce(
      (sum, c) => sum + Number(c.ChequeAmount || 0),
      0
    );
    const totalReceivedUnpaid = receivedUnpaid.reduce(
      (sum, c) => sum + Number(c.ChequeAmount || 0),
      0
    );

    res.json({
      status: 200,
      data: {
        cheques,
        totals: {
          issuedUnpaid: totalIssuedUnpaid,
          receivedUnpaid: totalReceivedUnpaid,
        },
      },
    });
  } catch (err) {
    console.error("❌ Error fetching cheques:", err);
    res.status(500).json({ error: "خطا در دریافت اطلاعات چک‌ها" });
  }
});


module.exports = router;
