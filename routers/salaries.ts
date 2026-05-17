import { Router } from "express";
import {
  createSalary,
  deleteSalaryById,
  editSalaryById,
  getAllSalaries,
  getSalarieById,
  getSalariesByDate,
  getSalariesByPersonId,
  getSalariesByYear,
} from "../controllers/salaries";

const router = Router();

router.get("/", getAllSalaries);
router.get("/byId/:id", getSalarieById);
router.get("/employee/:personId", getSalariesByPersonId);
router.get("/byPeriod/:year/:month", getSalariesByDate);
router.get("/byYear/:year", getSalariesByYear);
router.post("/", createSalary);
router.put("/byId/:id", editSalaryById);
router.delete("/byId/:id", deleteSalaryById);

export default router;
