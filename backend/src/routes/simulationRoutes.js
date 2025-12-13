import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const r = await axios.get("http://localhost:8000/api/simulation-analysis", {
      params: req.query,
    });
    return res.json(r.data);
  } catch (e) {
    return res.status(500).json({
      error: "ML service error",
      detail: e?.response?.data || e.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const r = await axios.post("http://localhost:8000/api/simulation-analysis", req.body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.json(r.data);
  } catch (e) {
    return res.status(500).json({
      error: "ML service error",
      detail: e?.response?.data || e.message,
    });
  }
});

export default router;
