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
router.get("/id/:id", getSalarieById);
router.get("/employee/:personId", getSalariesByPersonId);
router.get("/period/:year/:month", getSalariesByDate);
router.get("/year/:year", getSalariesByYear);
router.post("/", createSalary);
router.put("/id/:id", editSalaryById);
router.delete("/id/:id", deleteSalaryById);

export default router;
