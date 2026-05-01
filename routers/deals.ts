import express, { Request, Response, Router } from "express";
// import Deal, { getDealModel } from "../models/deals";
import { AuthRequest } from "../types/db";
import { getDealModel } from "../models/deals";

const router: Router = express.Router();

// GET all deals
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const deals = await DealModel.find();
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// GET deal by ID
router.get("/id/:id", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const deal = await DealModel.findById(req.params.id);
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
router.get("/vehicle/:vehicleId", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const deals = await DealModel.find({ vehicleId: req.params.vehicleId });
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// GET deals by VIN
router.get("/vin/:vin", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const { vin } = req.params;

    const deals = await DealModel.find({ "vehicleSnapshot.vin": vin });

    res.json(deals);
  } catch (error) {
    console.error("❌ Error fetching deals by VIN:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// GET deals by person (seller or buyer)
router.get("/person/:personId", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const { personId } = req.params;
    const deals = await DealModel.find({
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
router.get("/status/:status", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const deals = await DealModel.find({ status: req.params.status });
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
});

// POST create new deal
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const newDeal = new DealModel(req.body);
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
router.put("/id/:id", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const updatedDeal = await DealModel.findByIdAndUpdate(
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
  async (req: AuthRequest, res: Response) => {
    const { dealId, optionId } = req.params;
    const updateData = req.body;

    try {
      const DealModel = getDealModel(req.db);
      if (!DealModel) {
        return res.status(500).json({ error: "Deal model is not initialized" });
      }
      const updatedDeal = await DealModel.findOneAndUpdate(
        {
          _id: dealId,
          "directCosts.options._id": optionId,
        },
        {
          $set: {
            "directCosts.options.$.description": updateData.description,
            "directCosts.options.$.cost": updateData.cost,
            "directCosts.options.$.date": updateData.date,
            "directCosts.options.$.provider": updateData.provider,
          },
        },
        { new: true },
      );

      if (!updatedDeal) {
        return res.status(404).json({ error: "Deal or Option not found" });
      }

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
router.delete("/id/:id", async (req: AuthRequest, res: Response) => {
  try {
    const DealModel = getDealModel(req.db);
    if (!DealModel) {
      return res.status(500).json({ error: "Deal model is not initialized" });
    }
    const deletedDeal = await DealModel.findByIdAndDelete(req.params.id);
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
  async (req: AuthRequest, res: Response) => {
    const { dealId, optionId } = req.params;

    try {
      const DealModel = getDealModel(req.db);
      if (!DealModel) {
        return res.status(500).json({ error: "Deal model is not initialized" });
      }
      const deal = await DealModel.findById(dealId);

      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }

      const updatedOptions = deal.directCosts.options.filter(
        (option) => option._id && option._id.toString() !== optionId,
      );

      const updatedDeal = await DealModel.findByIdAndUpdate(
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
