import { Router } from "express";
import { createDeal, deleteDealById, deleteDealByOptionId, editDealById, editDealByOptionId, getAllDeals, getDealById, getDealsByPersonId, getDealsByStatus, getDealsByVehicleId, getDealsByVin } from "../controllers/deals";

const router = Router();

router.get("/", getAllDeals);
router.get("/byId/:id", getDealById);
router.get("/byVehicleId/:vehicleId", getDealsByVehicleId);
router.get("/byVin/:vin", getDealsByVin);
router.get("/byPersonId/:personId", getDealsByPersonId);
router.get("/byStatus/:status", getDealsByStatus);
router.post("/", createDeal);
router.put("/byId/:id", editDealById);
router.put("/:dealId/byOptionId/:optionId", editDealByOptionId);
router.delete("/byId/:id", deleteDealById);
router.delete("/:dealId/byOptionId/:optionId", deleteDealByOptionId);


export default router;
