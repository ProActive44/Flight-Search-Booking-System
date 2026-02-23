import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

// Load env variables first — before anything else
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check Route ───────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Flight Booking API is running",
        timestamp: new Date().toISOString(),
    });
});

// ─── Routes will be mounted here in future phases ─────────────
// app.use("/api/search", searchRouter);
// app.use("/api/flight", flightRouter);
// app.use("/api/booking", bookingRouter);

// ─── Start Server after DB connects ──────────────────────────
const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer();

export default app;
