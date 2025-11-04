// const Car = require("../models/cars");
// const router = require("express").Router();

// router.get("/cars", async (req, res) => {
//   try {
//     const data = await Car.find();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching cars" });
//   }
// });

// router.get("/cars/chassisNo", async (req, res) => {
//   try {
//     const cars = await Car.find({}, "ChassisNo");

//     const chassisList = cars.map((car) => car.ChassisNo);

//     res.json(chassisList);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching cars" });
//   }
// });

// router.get("/cars/:chassisNo", async (req, res) => {
//   const car = await Car.findOne({ ChassisNo: req.params.chassisNo });
//   if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });
//   res.json(car);
// });

// router.get("/cars/:chassisNo", async (req, res) => {
//   const car = await Car.findOne({ ChassisNo: req.params.chassisNo });
//   if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });
//   res.json(car);
// });

// router.get("/cars/:chassisNo/details", async (req, res) => {
//   const { chassisNo } = req.params;

//   try {
//     const car = await Car.findOne({ ChassisNo: chassisNo });
//     if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });

//     const chassisNoAsNumber = !isNaN(Number(chassisNo))
//       ? Number(chassisNo)
//       : null;

//     const cheques = await Cheque.find({
//       $or: [
//         { CarChassisNo: chassisNo },
//         ...(chassisNoAsNumber !== null
//           ? [{ CarChassisNo: chassisNoAsNumber }]
//           : []),
//       ],
//     });

//     const transactions = await Transaction.find({
//       $or: [
//         { ChassisNo: chassisNo },
//         ...(chassisNoAsNumber !== null
//           ? [{ ChassisNo: chassisNoAsNumber }]
//           : []),
//       ],
//     });

//     res.json({ car, cheques, transactions });
//   } catch (err) {
//     console.error("Error fetching details:", err);
//     res.status(500).json({ error: "Error fetching details" });
//   }
// });

// router.get("/cars/byNationalId/:nationalId", async (req, res) => {
//   const { nationalId } = req.params;

//   try {
//     const allTrades = await Car.find({
//       $or: [{ SellerNationalID: nationalId }, { BuyerNationalID: nationalId }],
//     });

//     const sales = allTrades.filter((t) => t.SellerNationalID === nationalId);
//     const purchases = allTrades.filter((t) => t.BuyerNationalID === nationalId);

//     res.status(200).json({
//       success: true,
//       count: allTrades.length,
//       sales,
//       purchases,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching trades:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Car = require("../models/cars");
const Cheque = require("../models/cheques");
const Transaction = require("../models/transaction");

router.get("/", async (req, res) => {
  try {
    const data = await Car.find();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

router.get("/userData", async (req, res) => {
  try {
    const data = await Car.find();

    const peopleMap = new Map();

    data.forEach((item) => {
      if (item.SellerName) {
        const key = item.SellerName;
        if (!peopleMap.has(key)) {
          peopleMap.set(key, {
            name: item.SellerName,
            nationalId: item.SellerNationalID,
            roles: ["seller"],
          });
        } else {
          const person = peopleMap.get(key);
          if (!person.roles.includes("seller")) person.roles.push("seller");
        }
      }

      if (item.BuyerName) {
        const key = item.BuyerName;
        if (!peopleMap.has(key)) {
          peopleMap.set(key, {
            name: item.BuyerName,
            nationalId: item.BuyerNationalID,
            roles: ["buyer"],
          });
        } else {
          const person = peopleMap.get(key);
          if (!person.roles.includes("buyer")) person.roles.push("buyer");
        }
      }
    });

    const uniquePeople = Array.from(peopleMap.values());

    res.json(uniquePeople);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching cars" });
  }
});

router.get("/filterByUser", async (req, res) => {
  try {
    const { nationalId, userName } = req.query;

    if (!nationalId && !userName) {
      return res
        .status(400)
        .json({ error: "Please provide nationalId or userName" });
    }

    const data = await Car.find();

    let filtered = [];

    if (nationalId) {
      filtered = data.filter(
        (item) =>
          item.BuyerNationalID === nationalId ||
          item.SellerNationalID === nationalId
      );
    } else if (userName) {
      const name = userName.toString().trim();
      filtered = data.filter(
        (item) =>
          item.BuyerName?.includes(name) || item.SellerName?.includes(name)
      );
    }

    const sales = filtered.filter(
      (item) =>
        (nationalId && item.SellerNationalID === nationalId) ||
        (!nationalId && item.SellerName?.includes(userName))
    );
    const purchases = filtered.filter(
      (item) =>
        (nationalId && item.BuyerNationalID === nationalId) ||
        (!nationalId && item.BuyerName?.includes(userName))
    );

    res.json({ purchases, sales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error filtering user transactions" });
  }
});

router.get("/chassisNo", async (req, res) => {
  try {
    const cars = await Car.find({}, "ChassisNo");
    res.json(cars.map((c) => c.ChassisNo));
  } catch {
    res.status(500).json({ error: "Error fetching chassis numbers" });
  }
});

router.get("/:chassisNo", async (req, res) => {
  try {
    const car = await Car.findOne({ ChassisNo: req.params.chassisNo });
    if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });
    res.json(car);
  } catch {
    res.status(500).json({ error: "Error fetching car" });
  }
});

// router.get("/:chassisNo/details", async (req, res) => {
//   const { chassisNo } = req.params;
//   try {
//     const car = await Car.findOne({ ChassisNo: chassisNo });
//     if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });

//     const chassisNoAsNumber = Number(chassisNo);
//     const cheques = await Cheque.find({
//       $or: [
//         { CarChassisNo: chassisNo },
//         ...(isNaN(chassisNoAsNumber)
//           ? []
//           : [{ CarChassisNo: chassisNoAsNumber }]),
//       ],
//     });
//     const transactions = await Transaction.find({
//       $or: [
//         { ChassisNo: chassisNo },
//         ...(isNaN(chassisNoAsNumber) ? [] : [{ ChassisNo: chassisNoAsNumber }]),
//       ],
//     });

//     res.json({ car, cheques, transactions });
//   } catch (err) {
//     console.error("Error fetching details:", err);
//     res.status(500).json({ error: "Error fetching details" });
//   }
// });

router.get("/:chassisNo/details", async (req, res) => {
  const { chassisNo } = req.params;
  try {
    const car = await Car.findOne({ ChassisNo: chassisNo });
    if (!car) return res.status(404).json({ message: "خودرو یافت نشد" });

    const chassisNoAsNumber = Number(chassisNo);
    const cheques = await Cheque.find({
      $or: [
        { CarChassisNo: chassisNo },
        ...(isNaN(chassisNoAsNumber)
          ? []
          : [{ CarChassisNo: chassisNoAsNumber }]),
      ],
    });
    const transactions = await Transaction.find({
      $or: [
        { ChassisNo: chassisNo },
        ...(isNaN(chassisNoAsNumber) ? [] : [{ ChassisNo: chassisNoAsNumber }]),
      ],
    });

    res.json({ car, cheques, transactions });
  } catch (err) {
    console.error("Error fetching details:", err);
    res.status(500).json({ error: "Error fetching details" });
  }
});

router.get("/byNationalId/:nationalId", async (req, res) => {
  const { nationalId } = req.params;
  try {
    const nationalIdAsNumber = Number(nationalId);
    const query = isNaN(nationalIdAsNumber)
      ? {
          $or: [
            { SellerNationalID: nationalId },
            { BuyerNationalID: nationalId },
          ],
        }
      : {
          $or: [
            { SellerNationalID: nationalId },
            { BuyerNationalID: nationalId },
            { SellerNationalID: nationalIdAsNumber },
            { BuyerNationalID: nationalIdAsNumber },
          ],
        };

    const allTrades = await Car.find(query);
    const sales = allTrades.filter((t) => t.SellerNationalID == nationalId);
    const purchases = allTrades.filter((t) => t.BuyerNationalID == nationalId);

    res.json({ success: true, count: allTrades.length, sales, purchases });
  } catch (err) {
    console.error("❌ Error fetching trades:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
