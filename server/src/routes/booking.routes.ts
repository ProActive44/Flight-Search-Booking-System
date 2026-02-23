import { Router } from "express";
import { book } from "../controllers/booking.controller";

const router = Router();

router.post("/", book);

export default router;
