const express = require("express");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const minePlannerRoutes = require("./routes/minePlannerRoutes");

const app = express();
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/shipping-planner", shippingRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/mine-planner", minePlannerRoutes);

app.get("/", (req, res) => res.json({ ok: true }));
module.exports = app;
