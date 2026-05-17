import { Router } from "express";
import {
  createPerson,
  deletePersonById,
  deletePersonWalletById,
  editPersonById,
  editPersonWalletById,
  getAllPeople,
  getPeopleById,
  getPeopleByName,
  getPeopleByNationalId,
  getPeopleByRole,
} from "../controllers/people";

const router = Router();

router.get("/", getAllPeople);
router.get("/byId/:id", getPeopleById);
router.get("/byNationalId/:nationalId", getPeopleByNationalId);
router.get("/byRole/:role", getPeopleByRole);
router.get("/search/:name", getPeopleByName);
router.post("/", createPerson);
router.put("/byId/:id", editPersonById);
router.put("/byId/:id/wallet", editPersonWalletById);
router.put("/byId/:id/wallet/delete", deletePersonWalletById);
router.delete("/byId/:id", deletePersonById);

export default router;
