import express, { Request, Response, Router } from "express";
import { getVehicleModel } from "../models/vehicles";
import { AuthRequest } from "../types/db";
// import Vehicle from "../models/vehicles";

const router: Router = express.Router();

// GET all vehicles

export const getAllVehicles = async (req: AuthRequest, res: Response) => {
  try {
    const VehicleModel = getVehicleModel(req.db);
    if (!VehicleModel) {
      return res
        .status(500)
        .json({ error: "Vehicle model is not initialized" });
    }
    const vehicles = await VehicleModel.find();
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Error fetching vehicles" });
  }
};


// GET vehicle by ID
export const getVehicleById = async (req: AuthRequest, res: Response) => {
  try {
    const VehicleModel = getVehicleModel(req.db);
    if (!VehicleModel) {
      return res
        .status(500)
        .json({ error: "Vehicle model is not initialized" });
    }
    const vehicle = await VehicleModel.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Error fetching vehicle" });
  }
}


// GET vehicle by VIN
export const getVehicleByVin = async (req: AuthRequest, res: Response) => {
  try {
    const VehicleModel = getVehicleModel(req.db);
    if (!VehicleModel) {
      return res
        .status(500)
        .json({ error: "Vehicle model is not initialized" });
    }
    const vehicle = await VehicleModel.findOne({ vin: req.params.vin });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Error fetching vehicle" });
  }
}

// POST create new vehicle
export const createVehicle =  async (req: AuthRequest, res: Response) => {
  try {
    const VehicleModel = getVehicleModel(req.db);
    if (!VehicleModel) {
      return res
        .status(500)
        .json({ error: "Vehicle model is not initialized" });
    }
    const newVehicle = new VehicleModel(req.body);
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({
      error: "Error creating vehicle",
      details: error.message,
    });
  }
}

// PUT update vehicle by ID
router.put("/id/:id", async (req: AuthRequest, res: Response) => {
  try {
    const VehicleModel = getVehicleModel(req.db);
    if (!VehicleModel) {
      return res
        .status(500)
        .json({ error: "Vehicle model is not initialized" });
    }
    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(updatedVehicle);
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      error: "Error updating vehicle",
      details: error.message,
    });
  }
});

// DELETE vehicle by ID
router.delete("/id/:id", async (req: AuthRequest, res: Response) => {
  try {
    const VehicleModel = getVehicleModel(req.db);
    if (!VehicleModel) {
      return res
        .status(500)
        .json({ error: "Vehicle model is not initialized" });
    }
    const deletedVehicle = await VehicleModel.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json({
      message: "Vehicle deleted successfully",
      vehicle: deletedVehicle,
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Error deleting vehicle" });
  }
});

export default router;
