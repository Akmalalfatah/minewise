import express from "express";
import cors from "cors";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import minePlannerRoutes from "./routes/minePlannerRoutes.js";
import shippingPlannerRoutes from "./routes/shippingPlannerRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "minewise-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mine-planner", minePlannerRoutes);
app.use("/api/shipping-planner", shippingPlannerRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/ai", aiChatRoutes);
app.use("/api/users", userRoutes);
app.use("/api", simulationRoutes);

export default app;
