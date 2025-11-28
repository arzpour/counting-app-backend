import { Router, Request, Response } from "express";
import Settings from "../models/settings";

const router = Router();

router.get("/brokers", async (req: Request, res: Response): Promise<void> => {
  try {
    const sheets = await Settings.find({});

    const findSheet = (name: string) =>
      sheets.find(
        (s) => (s["نام شیت اطلاعات خودرو"] || "").trim() === name.trim()
      );

    const agents = findSheet("کارگزاران");
    const buyPercents = findSheet("درصد خرید");
    const sellPercents = findSheet("درصد فروش");

    if (!agents || !buyPercents || !sellPercents) {
      res.status(404).json({ message: "شیت‌ها یافت نشدند" });
      return;
    }

    const getValues = (obj: any): any[] =>
      Object.keys(obj)
        .filter((k) => k === "data" || k.startsWith("__EMPTY"))
        .map((k) => obj[k]);

    const agentNames = getValues(agents);
    const buyValues = getValues(buyPercents);
    const sellValues = getValues(sellPercents);

    const result = agentNames.map((name: any, i: number) => ({
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

function extractDataArray(doc: any): any[] {
  return Object.keys(doc)
    .filter((key) => key === "data" || key.startsWith("__EMPTY"))
    .map((key) => doc[key])
    .filter(Boolean);
}

router.get(
  "/transaction-form-options",
  async (req: Request, res: Response): Promise<void> => {
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

      const keyMap: { [key: string]: string } = {
        "روش تراکنش": "transactionWay",
        "انواع تراکنش": "transactionType",
        "دلیل تراکنش": "transactionReason",
        "شماره کارت‌های نمایشگاه": "showroomCards",
      };

      const result: { [key: string]: any[] } = {};
      for (const doc of docs) {
        const originalKey = doc["نام شیت اطلاعات خودرو"];
        const englishKey = keyMap[originalKey] || originalKey;

        const values: any[] = [];

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
  }
);

export default router;

