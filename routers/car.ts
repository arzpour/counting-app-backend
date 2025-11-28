import express, { Router, Request, Response } from "express";
import Car from "../models/cars";
import Cheque from "../models/cheques";
import Transaction from "../models/transaction";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Car.find();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// GET car by ID
router.get("/id/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }
    res.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ error: "Error fetching car" });
  }
});

// POST - Create new car
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const carData = req.body;
    const newCar = new Car(carData);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error: any) {
    console.error("Error creating car:", error);
    res
      .status(500)
      .json({ error: "Error creating car", details: error.message });
  }
});

// PUT - Update car by ID
router.put("/id/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    res.json(updatedCar);
  } catch (error: any) {
    console.error("Error updating car:", error);
    res
      .status(500)
      .json({ error: "Error updating car", details: error.message });
  }
});

function normalizeName(name: string | undefined | null): string | null {
  if (!name) return null;
  return name.trim().toLowerCase();
}

router.get("/userData", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Car.find();
    const peopleMap = new Map<
      string,
      {
        name: string;
        normalized: string;
        nationalId: string | null;
        roles: string[];
      }
    >();

    data.forEach((item) => {
      if (item.SellerName) {
        const rawName = item.SellerName;
        const key = normalizeName(rawName);
        if (!key) return;

        if (!peopleMap.has(key)) {
          peopleMap.set(key, {
            name: rawName.trim(),
            normalized: key,
            nationalId: item.SellerNationalID || null,
            roles: ["seller"],
          });
        } else {
          const person = peopleMap.get(key)!;
          if (!person.roles.includes("seller")) person.roles.push("seller");
          if ((rawName || "").length > (person.name || "").length) {
            person.name = rawName.trim();
          }
          if (!person.nationalId && item.SellerNationalID) {
            person.nationalId = item.SellerNationalID;
          }
        }
      }

      if (item.BuyerName) {
        const rawName = item.BuyerName;
        const key = normalizeName(rawName);
        if (!key) return;

        if (!peopleMap.has(key)) {
          peopleMap.set(key, {
            name: rawName.trim(),
            normalized: key,
            nationalId: item.BuyerNationalID || null,
            roles: ["buyer"],
          });
        } else {
          const person = peopleMap.get(key)!;
          if (!person.roles.includes("buyer")) person.roles.push("buyer");
          if ((rawName || "").length > (person.name || "").length) {
            person.name = rawName.trim();
          }
          if (!person.nationalId && item.BuyerNationalID) {
            person.nationalId = item.BuyerNationalID;
          }
        }
      }
    });

    const uniquePeople = Array.from(peopleMap.values()).map(
      ({ normalized, ...rest }) => rest
    );

    res.json(uniquePeople);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching cars" });
  }
});

router.get(
  "/filterByUser",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { nationalId, userName } = req.query;

      if (!nationalId && !userName) {
        res
          .status(400)
          .json({ error: "Please provide nationalId or userName" });
        return;
      }

      const data = await Car.find();

      let filtered: typeof data = [];

      if (nationalId) {
        filtered = data.filter(
          (item) =>
            item.BuyerNationalID === nationalId ||
            item.SellerNationalID === nationalId
        );
      } else if (userName) {
        const q = normalizeName(userName.toString());
        filtered = data.filter((item) => {
          const buyerNorm = normalizeName(item.BuyerName);
          const sellerNorm = normalizeName(item.SellerName);
          return (
            (buyerNorm && buyerNorm.includes(q || "")) ||
            (sellerNorm && sellerNorm.includes(q || ""))
          );
        });
      }

      const sales = filtered.filter((item) => {
        if (nationalId) return item.SellerNationalID === nationalId;
        const sellerNorm = normalizeName(item.SellerName);
        return (
          sellerNorm &&
          sellerNorm.includes(normalizeName(userName?.toString() || "") || "")
        );
      });

      const purchases = filtered.filter((item) => {
        if (nationalId) return item.BuyerNationalID === nationalId;
        const buyerNorm = normalizeName(item.BuyerName);
        return (
          buyerNorm &&
          buyerNorm.includes(normalizeName(userName?.toString() || "") || "")
        );
      });

      res.json({ purchases, sales });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error filtering user transactions" });
    }
  }
);

router.get("/chassisNo", async (req: Request, res: Response): Promise<void> => {
  try {
    const cars = await Car.find({}, "ChassisNo");
    res.json(cars.map((c) => c.ChassisNo));
  } catch {
    res.status(500).json({ error: "Error fetching chassis numbers" });
  }
});

router.get(
  "/:chassisNo",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const car = await Car.findOne({ ChassisNo: req.params.chassisNo });
      if (!car) {
        res.status(404).json({ message: "خودرو یافت نشد" });
        return;
      }
      res.json(car);
    } catch {
      res.status(500).json({ error: "Error fetching car" });
    }
  }
);

router.get(
  "/:chassisNo/details",
  async (req: Request, res: Response): Promise<void> => {
    const { chassisNo } = req.params;
    try {
      const car = await Car.findOne({ ChassisNo: chassisNo });
      if (!car) {
        res.status(404).json({ message: "خودرو یافت نشد" });
        return;
      }

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
  }
);

router.get(
  "/byNationalId/:nationalId",
  async (req: Request, res: Response): Promise<void> => {
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
      const purchases = allTrades.filter(
        (t) => t.BuyerNationalID == nationalId
      );

      res.json({ success: true, count: allTrades.length, sales, purchases });
    } catch (err) {
      console.error("❌ Error fetching trades:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

export default router;

