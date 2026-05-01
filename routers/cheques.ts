import { Router } from "express";
import {
  addActionToCheque,
  createCheque,
  deleteChequeById,
  editChequeById,
  getAllCheques,
  getAllChequesByVin,
  getChequeById,
  getChequesByDealId,
  getChequesByPersonId,
  getChequesByStatus,
  getUnPaidChequesByDealId,
} from "../controllers/cheques";

const router = Router();

router.get("/", getAllCheques);
router.get("/byVin/:vin", getAllChequesByVin);
router.get("/byId/:id", getChequeById);
router.get("/byDealId/:dealId", getChequesByDealId);
router.get("/byPersonId/:personId", getChequesByPersonId);
router.get("/byStatus/:status", getChequesByStatus);
router.get("/unpaid/byDealId/:dealId", getUnPaidChequesByDealId);
router.post("/", createCheque);
router.put("/byId/:id", editChequeById);
router.post("/byId/:id/action", addActionToCheque);
router.delete("/byId/:id", deleteChequeById);

export default router;
