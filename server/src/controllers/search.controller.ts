import { Request, Response } from "express";
import { searchFlights } from "../services/search.service";

export const search = (_req: Request, res: Response): void => {
    try {
        const result = searchFlights();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load flight data" });
    }
};
