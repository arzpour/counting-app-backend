import { Router, Request, Response } from "express";
import Cheque from "../models/cheques";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Cheque.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

// More specific route must come before generic route
router.get(
  "/unpaid/:chassisNo",
  async (req: Request, res: Response): Promise<void> => {
    const { chassisNo } = req.params;

    try {
      const chassisAsNumber = Number(chassisNo);
      const chassisAsString = String(chassisNo);

      // Build array of possible values to match
      const possibleValues: (string | number)[] = [chassisNo, chassisAsString];
      if (!isNaN(chassisAsNumber)) {
        possibleValues.push(chassisAsNumber);
      }

      // Try direct matches first
      let cheques = await Cheque.find({
        CarChassisNo: { $in: possibleValues },
      });

      // If no results and it's a valid number, try type conversion
      if (cheques.length === 0 && !isNaN(chassisAsNumber)) {
        cheques = await Cheque.find({
          $expr: {
            $or: [
              // Convert field to int and compare
              {
                $eq: [
                  {
                    $convert: {
                      input: "$CarChassisNo",
                      to: "int",
                      onError: null,
                      onNull: null,
                    },
                  },
                  chassisAsNumber,
                ],
              },
              // Convert field to string and compare
              {
                $eq: [
                  {
                    $convert: {
                      input: "$CarChassisNo",
                      to: "string",
                      onError: null,
                      onNull: null,
                    },
                  },
                  chassisAsString,
                ],
              },
              // Try converting input to match field type
              {
                $eq: [
                  "$CarChassisNo",
                  {
                    $convert: {
                      input: chassisAsString,
                      to: "int",
                      onError: null,
                      onNull: null,
                    },
                  },
                ],
              },
            ],
          },
        });
      }

      console.log(
        `🔍 Route /unpaid/:chassisNo - Chassis: ${chassisNo}, Found: ${cheques.length} cheques`
      );

      if (!cheques.length) {
        res
          .status(404)
          .json({ message: "هیچ چکی برای این شاسی یافت نشد" });
        return;
      }

      const issuedUnpaid = cheques.filter(
        (c) => c.ChequeType === "صادره" && c.ChequeStatus !== "وصول شد"
      );
      const receivedUnpaid = cheques.filter(
        (c) => c.ChequeType === "وارده" && c.ChequeStatus !== "وصول شد"
      );

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
  }
);

router.get(
  "/:chassisNo",
  async (req: Request, res: Response): Promise<void> => {
    const { chassisNo } = req.params;

    try {
      const chassisAsNumber = Number(chassisNo);
      const chassisAsString = String(chassisNo);

      // Build array of possible values to match
      const possibleValues: (string | number)[] = [chassisNo, chassisAsString];
      if (!isNaN(chassisAsNumber)) {
        possibleValues.push(chassisAsNumber);
      }

      // Try direct matches first
      let cheques = await Cheque.find({
        CarChassisNo: { $in: possibleValues },
      });

      // If no results and it's a valid number, try type conversion
      if (cheques.length === 0 && !isNaN(chassisAsNumber)) {
        cheques = await Cheque.find({
          $expr: {
            $or: [
              // Convert field to int and compare
              {
                $eq: [
                  {
                    $convert: {
                      input: "$CarChassisNo",
                      to: "int",
                      onError: null,
                      onNull: null,
                    },
                  },
                  chassisAsNumber,
                ],
              },
              // Convert field to string and compare
              {
                $eq: [
                  {
                    $convert: {
                      input: "$CarChassisNo",
                      to: "string",
                      onError: null,
                      onNull: null,
                    },
                  },
                  chassisAsString,
                ],
              },
              // Try converting input to match field type
              {
                $eq: [
                  "$CarChassisNo",
                  {
                    $convert: {
                      input: chassisAsString,
                      to: "int",
                      onError: null,
                      onNull: null,
                    },
                  },
                ],
              },
            ],
          },
        });
      }

      console.log(
        `🔍 Route /:chassisNo - Chassis: ${chassisNo}, Found: ${cheques.length} cheques`
      );
      res.json(cheques);
    } catch (err) {
      console.log("🔹 err:", err);
      res.status(500).json({ error: "Error fetching cheques" });
    }
  }
);

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const newCheque = new Cheque(req.body);
    const savedCheque = await newCheque.save();
    res.status(201).json(savedCheque);
  } catch (error: any) {
    console.error("Error creating cheque:", error);
    res
      .status(500)
      .json({ error: "Error creating cheque", details: error.message });
  }
});

export default router;

