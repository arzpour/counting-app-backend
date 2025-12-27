import express, { Request, Response, Router } from "express";
import People from "../models/people";
import User from "../models/user";

const router: Router = express.Router();

// GET all people
router.get("/", async (req: Request, res: Response) => {
  try {
    const people = await People.find();
    res.json(people);
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).json({ error: "Error fetching people" });
  }
});

// GET person by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const person = await People.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(500).json({ error: "Error fetching person" });
  }
});

// GET person by national ID
router.get("/national-id/:nationalId", async (req: Request, res: Response) => {
  try {
    const person = await People.findOne({ nationalId: Number(req.params.nationalId) });
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(500).json({ error: "Error fetching person" });
  }
});

// GET people by role
router.get("/role/:role", async (req: Request, res: Response) => {
  try {
    const people = await People.find({ roles: req.params.role });
    res.json(people);
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).json({ error: "Error fetching people" });
  }
});

// GET people by name search
router.get("/search/:name", async (req: Request, res: Response) => {
  try {
    const people = await People.find({
      $or: [
        { firstName: { $regex: req.params.name, $options: "i" } },
        { lastName: { $regex: req.params.name, $options: "i" } },
      ],
    });
    res.json(people);
  } catch (error) {
    console.error("Error searching people:", error);
    res.status(500).json({ error: "Error searching people" });
  }
});

// POST create new person
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.role === "secretary") {
        if (req.body.roles && Array.isArray(req.body.roles)) {
          const hasNonCustomerRole = req.body.roles.some(
            (role: string) => role !== "customer"
          );
          if (hasNonCustomerRole) {
            return res.status(403).json({
              error: "Secretary can only create people with customer role",
            });
          }
        } else {
          req.body.roles = ["customer"];
        }
      }
    }

    const newPerson = new People(req.body);
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (error: any) {
    console.error("Error creating person:", error);
    res.status(500).json({
      error: "Error creating person",
      details: error.message,
    });
  }
});

// PUT update person by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.role === "secretary") {
        if (req.body.roles && Array.isArray(req.body.roles)) {
          const hasNonCustomerRole = req.body.roles.some(
            (role: string) => role !== "customer"
          );
          if (hasNonCustomerRole) {
            return res.status(403).json({
              error: "Secretary can only set people to customer role",
            });
          }
        } else if (req.body.roles !== undefined) {
          req.body.roles = ["customer"];
        }
      }
    }

    const updatedPerson = await People.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(updatedPerson);
  } catch (error: any) {
    console.error("Error updating person:", error);
    res.status(500).json({
      error: "Error updating person",
      details: error.message,
    });
  }
});

// PUT update wallet balance
router.put("/id/:id/wallet", async (req: Request, res: Response) => {
  try {
    const { amount, type, description } = req.body;
    const person = await People.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    const transaction = {
      amount,
      type,
      description,
      date: new Date().toISOString(),
    };

    person.wallet = person.wallet || { balance: 0, transactions: [] };
    person.wallet.balance = (person.wallet.balance || 0) + amount;
    person.wallet.transactions = person.wallet.transactions || [];
    person.wallet.transactions.push(transaction);

    await person.save();
    res.json(person);
  } catch (error: any) {
    console.error("Error updating wallet:", error);
    res.status(500).json({
      error: "Error updating wallet",
      details: error.message,
    });
  }
});

// DELETE person by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedPerson = await People.findByIdAndDelete(req.params.id);
    if (!deletedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json({ message: "Person deleted successfully", person: deletedPerson });
  } catch (error) {
    console.error("Error deleting person:", error);
    res.status(500).json({ error: "Error deleting person" });
  }
});

export default router;
