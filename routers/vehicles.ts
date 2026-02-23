import express, { Request, Response, Router } from "express";
import Vehicle from "../models/vehicles";

const router: Router = express.Router();

// GET all vehicles
router.get("/", async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Error fetching vehicles" });
  }
});

// GET vehicle by ID
router.get("/id/:id", async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Error fetching vehicle" });
  }
});

// GET vehicle by VIN
router.get("/vin/:vin", async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOne({ vin: req.params.vin });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Error fetching vehicle" });
  }
});

// POST create new vehicle
router.post("/", async (req: Request, res: Response) => {
  try {
    const newVehicle = new Vehicle(req.body);
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({
      error: "Error creating vehicle",
      details: error.message
    });
  }
});

// PUT update vehicle by ID
router.put("/id/:id", async (req: Request, res: Response) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(updatedVehicle);
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      error: "Error updating vehicle",
      details: error.message
    });
  }
});

// DELETE vehicle by ID
router.delete("/id/:id", async (req: Request, res: Response) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully", vehicle: deletedVehicle });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Error deleting vehicle" });
  }
});

export default router;

