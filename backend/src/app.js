import express from "express";
import cors from "cors";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import minePlannerRoutes from "./routes/minePlannerRoutes.js";
import shippingPlannerRoutes from "./routes/shippingPlannerRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mine-planner", minePlannerRoutes);
app.use("/api/shipping-planner", shippingPlannerRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/ai", aiChatRoutes);

export default app;
