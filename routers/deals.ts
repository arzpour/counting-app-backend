import express, { Request, Response, Router } from "express";
import Deal from "../models/deals";

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
    const deals = await Deal.find({ vehicleId: Number(req.params.vehicleId) });
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
    console.log(`🔍 Fetching deals for VIN: ${vin}`);

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
      d.partnerships?.some((p) => p.partner.personId === personId)
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
    const savedDeal = await newDeal.save();
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
      { new: true, runValidators: true }
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

export default router;
