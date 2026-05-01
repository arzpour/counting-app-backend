import express, { Request, Response, Router } from "express";
import Deal from "../models/deals";
import mongoose from "mongoose";

const router: Router = express.Router();

// GET all deals
router.get("/", async (req: Request, res: Response) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// GET deal by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: "Deal not found" });
    }
    res.json(deal);
  } catch (error) {
    console.error("Error fetching deal:", error);
    res.status(500).json({ error: "Error fetching deal" });
  }
});

// GET deals by vehicle ID
router.get("/vehicle/:vehicleId", async (req: Request, res: Response) => {
  try {
    const deals = await Deal.find({ vehicleId: req.params.vehicleId });
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// GET deals by VIN
router.get("/vin/:vin", async (req: Request, res: Response) => {
  try {
    const { vin } = req.params;

    const deals = await Deal.find({ "vehicleSnapshot.vin": vin });
    console.log(`✅ Found ${deals.length} deals for VIN: ${vin}`);

    res.json(deals);
  } catch (error) {
    console.error("❌ Error fetching deals by VIN:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// GET deals by person (seller or buyer)
router.get("/person/:personId", async (req: Request, res: Response) => {
  try {
    const { personId } = req.params;
    const deals = await Deal.find({
      $or: [
        { "seller.personId": personId },
        { "buyer.personId": personId },
        { "partnerships.partner.personId": personId },
      ],
    });

    const sales = deals.filter((d) => d.seller?.personId === personId);
    const purchases = deals.filter((d) => d.buyer?.personId === personId);
    const partnerships = deals.filter((d) =>
      d.partnerships?.some((p) => p.partner.personId === personId),
    );

    res.json({ deals, sales, purchases, partnerships });
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// GET deals by status
router.get("/status/:status", async (req: Request, res: Response) => {
  try {
    const deals = await Deal.find({ status: req.params.status });
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// POST create new deal
router.post("/", async (req: Request, res: Response) => {
  try {
    const newDeal = new Deal(req.body);
    console.log("🚀 ~ req.body:", req.body)
    console.log("🚀 ~ newDeal:", newDeal)
    const savedDeal = await newDeal.save();
    console.log("🚀 ~ savedDeal:", savedDeal)
    res.status(201).json(savedDeal);
  } catch (error: any) {
    console.error("Error creating deal:", error);
    res.status(500).json({
      error: "Error creating deal",
      details: error.message,
    });
  }
});

// PUT update deal by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedDeal) {
      return res.status(404).json({ error: "Deal not found" });
    }
    res.json(updatedDeal);
  } catch (error: any) {
    console.error("Error updating deal:", error);
    res.status(500).json({
      error: "Error updating deal",
      details: error.message,
    });
  }
});

// PUT /api/deals/:dealId/option/:optionId
router.put(
  "/:dealId/option/:optionId",
  async (req: Request, res: Response) => {
    const { dealId, optionId } = req.params;
    // فرض بر این است که بدنه درخواست (req.body) شامل فیلدهای قابل تغییر است
    // مثلا: { description: "توضیحات جدید", cost: 500000 }
    const updateData = req.body;

    try {
      // استفاده از $set و نوتیشن دات برای آپدیت مستقیم آیتم داخل آرایه
      // "directCosts.options.$" به مونگو می‌گوید که اولین آیتمی که شرط را دارد را پیدا کن و آپدیت کن
      const updatedDeal = await Deal.findOneAndUpdate(
        { 
          _id: dealId, 
          "directCosts.options._id": optionId // شرط: آیتمی با این ID پیدا کن
        },
        { 
          $set: { 
            // اینجا فیلدهایی که می‌خواهید آپدیت شوند را لیست کنید
            "directCosts.options.$.description": updateData.description,
            "directCosts.options.$.cost": updateData.cost,
            "directCosts.options.$.date": updateData.date,
            // اگر provider هم آپدیت شود:
            "directCosts.options.$.provider": updateData.provider
          } 
        },
        { new: true } // برگرداندن داکیومنت بعد از آپدیت
      );

      if (!updatedDeal) {
        return res.status(404).json({ error: "Deal or Option not found" });
      }

      console.log("✅ Option updated successfully");
      res.json(updatedDeal);

    } catch (error: any) {
      console.error("Error updating direct cost option:", error);
      res.status(500).json({
        error: "Error updating direct cost option",
        details: error.message,
      });
    }
  },
);

// DELETE deal by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
    if (!deletedDeal) {
      return res.status(404).json({ error: "Deal not found" });
    }
    res.json({ message: "Deal deleted successfully", deal: deletedDeal });
  } catch (error) {
    console.error("Error deleting deal:", error);
    res.status(500).json({ error: "Error deleting deal" });
  }
});

// DELETE /api/deals/:dealId/option/:optionId
router.delete(
  "/:dealId/option/:optionId",
  async (req: Request, res: Response) => {
    const { dealId, optionId } = req.params;

    try {
      const deal = await Deal.findById(dealId);

      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }

      const updatedOptions = deal.directCosts.options.filter(
        (option) => option._id && option._id.toString() !== optionId,
      );

      const updatedDeal = await Deal.findByIdAndUpdate(
        dealId,
        { $set: { "directCosts.options": updatedOptions } },
        { new: true },
      );

      res.json(updatedDeal);
    } catch (error: any) {
      console.error("Error deleting direct cost option:", error);
      res.status(500).json({
        error: "Error deleting direct cost option",
        details: error.message,
      });
    }
  },
);

export default router;
