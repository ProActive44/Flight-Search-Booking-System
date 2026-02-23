import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import searchRouter from "./routes/search.routes";
import flightRouter from "./routes/flight.routes";
import bookingRouter from "./routes/booking.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Allowed origins — ENV var lets you add more without code changes
const ALLOWED_ORIGINS = [
    "https://flight-search-booking-system.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.CORS_ORIGIN,           // extra origin from env if set
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Handle preflight OPTIONS for every route first
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());


app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Flight Booking API is running",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/search", searchRouter);
app.use("/api/flight", flightRouter);
app.use("/api/booking", bookingRouter);

const startServer = async (): Promise<void> => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer();

export default app;
