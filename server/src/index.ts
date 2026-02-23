import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import searchRouter from "./routes/search.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Flight Booking API is running",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/search", searchRouter);

const startServer = async (): Promise<void> => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer();

export default app;
