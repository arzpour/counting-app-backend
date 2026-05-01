import { Router } from "express";

const router = Router();

router.get("/",getAllVehicles );
router.get("/byId/:id",getVehicleById );
router.get("/byVin/:vin", getVehicleByVin);
router.post("/",createVehicle);


export default router;
