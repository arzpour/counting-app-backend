import express, { Request, Response, Router } from "express";
import Cheque from "../models/cheques-new";

const router: Router = express.Router();

// GET all cheques
router.get("/", async (req: Request, res: Response) => {
  try {
    const cheques = await Cheque.find();
    res.json(cheques);
  } catch (error) {
    console.error("Error fetching cheques:", error);
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

// GET cheque by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).json({ error: "Cheque not found" });
    }
    res.json(cheque);
  } catch (error) {
    console.error("Error fetching cheque:", error);
    res.status(500).json({ error: "Error fetching cheque" });
  }
});

// GET cheques by deal ID
router.get("/deal/:dealId", async (req: Request, res: Response) => {
  try {
    const cheques = await Cheque.find({ relatedDealId: req.params.dealId });
    res.json(cheques);
  } catch (error) {
    console.error("Error fetching cheques:", error);
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

// GET cheques by person ID (payer or payee)
router.get("/person/:personId", async (req: Request, res: Response) => {
  try {
    const { personId } = req.params;
    const cheques = await Cheque.find({
      $or: [
        { "payer.personId": personId },
        { "payee.personId": personId },
      ],
    });

    const issued = cheques.filter((c) => c.payer?.personId === personId);
    const received = cheques.filter((c) => c.payee?.personId === personId);

    res.json({ cheques, issued, received });
  } catch (error) {
    console.error("Error fetching cheques:", error);
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

// GET cheques by status
router.get("/status/:status", async (req: Request, res: Response) => {
  try {
    const cheques = await Cheque.find({ status: req.params.status });
    res.json(cheques);
  } catch (error) {
    console.error("Error fetching cheques:", error);
    res.status(500).json({ error: "Error fetching cheques" });
  }
});

// GET unpaid cheques by deal ID
router.get("/unpaid/deal/:dealId", async (req: Request, res: Response) => {
  try {
    const cheques = await Cheque.find({
      relatedDealId: req.params.dealId,
      status: { $ne: "paid" },
    });

    const issued = cheques.filter((c) => c.type === "issued");
    const received = cheques.filter((c) => c.type === "received");

    const totalIssuedUnpaid = issued.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalReceivedUnpaid = received.reduce((sum, c) => sum + (c.amount || 0), 0);

    res.json({
      cheques,
      totals: {
        issuedUnpaid: totalIssuedUnpaid,
        receivedUnpaid: totalReceivedUnpaid,
      },
    });
  } catch (error) {
    console.error("Error fetching unpaid cheques:", error);
    res.status(500).json({ error: "Error fetching unpaid cheques" });
  }
});

// POST create new cheque
router.post("/", async (req: Request, res: Response) => {
  try {
    const newCheque = new Cheque(req.body);
    const savedCheque = await newCheque.save();
    res.status(201).json(savedCheque);
  } catch (error: any) {
    console.error("Error creating cheque:", error);
    res.status(500).json({ 
      error: "Error creating cheque", 
      details: error.message 
    });
  }
});

// PUT update cheque by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const updatedCheque = await Cheque.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedCheque) {
      return res.status(404).json({ error: "Cheque not found" });
    }
    res.json(updatedCheque);
  } catch (error: any) {
    console.error("Error updating cheque:", error);
    res.status(500).json({ 
      error: "Error updating cheque", 
      details: error.message 
    });
  }
});

// POST add action to cheque
router.post("/id/:id/action", async (req: Request, res: Response) => {
  try {
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).json({ error: "Cheque not found" });
    }

    const action = {
      actionType: req.body.actionType,
      actionDate: req.body.actionDate || new Date().toISOString(),
      actorUserId: req.body.actorUserId,
      description: req.body.description,
    };

    cheque.actions = cheque.actions || [];
    cheque.actions.push(action);
    await cheque.save();

    res.json(cheque);
  } catch (error: any) {
    console.error("Error adding action:", error);
    res.status(500).json({ 
      error: "Error adding action", 
      details: error.message 
    });
  }
});

// DELETE cheque by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedCheque = await Cheque.findByIdAndDelete(req.params.id);
    if (!deletedCheque) {
      return res.status(404).json({ error: "Cheque not found" });
    }
    res.json({ message: "Cheque deleted successfully", cheque: deletedCheque });
  } catch (error) {
    console.error("Error deleting cheque:", error);
    res.status(500).json({ error: "Error deleting cheque" });
  }
});

export default router;

