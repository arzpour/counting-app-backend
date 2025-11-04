const Settings = require("../models/settings");
const router = require("express").Router();

router.get("/brokers", async (req, res) => {
  try {
    const sheets = await Settings.find({});

    const findSheet = (name) =>
      sheets.find(
        (s) => (s["نام شیت اطلاعات خودرو"] || "").trim() === name.trim()
      );

    const agents = findSheet("کارگزاران");
    const buyPercents = findSheet("درصد خرید");
    const sellPercents = findSheet("درصد فروش");

    if (!agents || !buyPercents || !sellPercents) {
      return res.status(404).json({ message: "شیت‌ها یافت نشدند" });
    }

    const getValues = (obj) =>
      Object.keys(obj)
        .filter((k) => k === "data" || k.startsWith("__EMPTY"))
        .map((k) => obj[k]);

    const agentNames = getValues(agents);
    const buyValues = getValues(buyPercents);
    const sellValues = getValues(sellPercents);

    const result = agentNames.map((name, i) => ({
      name,
      buyPercent: buyValues[i] || 0,
      sellPercent: sellValues[i] || 0,
    }));

    res.json({ status: 200, data: result });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "خطا در دریافت اطلاعات کارگزاران" });
  }
});
function extractDataArray(doc) {
  return Object.keys(doc)
    .filter((key) => key === "data" || key.startsWith("__EMPTY"))
    .map((key) => doc[key])
    .filter(Boolean);
}

// router.get("/transaction-form-options", async (req, res) => {
//   try {
//     const names = [
//       "روش تراکنش",
//       "انواع تراکنش",
//       "دلیل تراکنش",
//       "شماره کارت‌های نمایشگاه",
//     ];

//     const docs = await Settings.find({
//       "نام شیت اطلاعات خودرو": { $in: names },
//     }).lean();

//     const keyMap = {
//       "روش تراکنش": "transactionWay",
//       "انواع تراکنش": "transactionType",
//       "دلیل تراکنش": "transactionReason",
//       "شماره کارت‌های نمایشگاه": "showroomCards",
//     };

//     const result = {};
//     for (const doc of docs) {
//       const originalKey = doc["نام شیت اطلاعات خودرو"];
//       const englishKey = keyMap[originalKey] || originalKey;
//       const values = extractDataArray(doc);

//       result[englishKey] = values;
//     }

//     res.json(result);
//   } catch (error) {
//     console.error("❌ Error fetching settings:", error);
//     res.status(500).json({ message: "خطا در دریافت تنظیمات" });
//   }
// });

router.get("/transaction-form-options", async (req, res) => {
  try {
    const names = [
      "روش تراکنش",
      "انواع تراکنش",
      "دلیل تراکنش",
      "شماره کارت‌های نمایشگاه",
    ];

    const docs = await Settings.find({
      "نام شیت اطلاعات خودرو": { $in: names },
    }).lean();

    const keyMap = {
      "روش تراکنش": "transactionWay",
      "انواع تراکنش": "transactionType",
      "دلیل تراکنش": "transactionReason",
      "شماره کارت‌های نمایشگاه": "showroomCards",
    };

    const result = {};
    for (const doc of docs) {
      const originalKey = doc["نام شیت اطلاعات خودرو"];
      const englishKey = keyMap[originalKey] || originalKey;

      const values = [];

      if (Array.isArray(doc.data)) values.push(...doc.data);

      Object.keys(doc)
        .filter((k) => k.startsWith("__EMPTY"))
        .forEach((k) => {
          const v = doc[k];
          if (v !== null && v !== "null" && v !== "NA" && v !== "") {
            values.push(v.toString());
          }
        });

      result[englishKey] = values;
    }

    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    res.status(500).json({ message: "خطا در دریافت تنظیمات" });
  }
});

module.exports = router;
