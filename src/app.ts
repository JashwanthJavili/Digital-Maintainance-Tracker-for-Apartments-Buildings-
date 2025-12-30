import technicianRoutes from "./routes/technician.routes";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/technician", technicianRoutes);

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware (MUST be last)
app.use(errorHandler);

export default app;
