import { Router } from "express";
import { createVehicle, deleteVehicleById, editVehicleById, getAllVehicles, getVehicleById, getVehicleByVin } from "../controllers/vehicles";

const router = Router();

router.get("/", getAllVehicles);
router.get("/byId/:id", getVehicleById);
router.get("/byVin/:vin", getVehicleByVin);
router.post("/", createVehicle);
router.put("/byId/:id", editVehicleById);
router.delete("/byId/:id", deleteVehicleById);

export default router;
