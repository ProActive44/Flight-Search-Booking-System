import { Router } from "express";
import { select } from "../controllers/flight.controller";

const router = Router();

router.post("/select", select);

export default router;
