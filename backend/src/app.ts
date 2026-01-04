import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import technicianRoutes from "./routes/technician.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import requestRoutes from "./routes/request.routes";
import authRoutes from "./routes/auth.routes";

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Digital Maintenance Tracker API running");
});

export default app;
