import express, { Express, Request, Response } from "express";
import residentRoutes from "./resident/routes/resident.routes";

const app: Express = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/resident", residentRoutes);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Digital Maintenance Tracker API running");
});

export default app;
