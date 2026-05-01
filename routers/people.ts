import { Router } from "express";
import { createPerson, deletePersonById, deletePersonWalletById, editPersonById, editPersonWalletById, getAllPeople, getPeopleById, getPeopleByName, getPeopleByNationalId, getPeopleByRole } from "../controllers/people";

const router = Router();

router.get("/", getAllPeople);
router.get("/id/:id", getPeopleById);
router.get("/national-id/:nationalId", getPeopleByNationalId);
router.get("/role/:role", getPeopleByRole);
router.get("/search/:name", getPeopleByName);
router.post("/", createPerson);
router.put("/id/:id", editPersonById);
router.put("/id/:id/wallet", editPersonWalletById);
router.put("/id/:id/wallet/delete", deletePersonWalletById);
router.delete("/id/:id", deletePersonById);

export default router;
