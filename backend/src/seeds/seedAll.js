import pool from "../db/index.js";
import { loadJSON } from "../utils/jsonLoader.js";

async function seedDashboard() {
    const json = loadJSON("dashboard.json");
    const sql = `
      INSERT INTO dashboard_raw (raw_json)
      VALUES (?)`;
    await pool.execute(sql, [JSON.stringify(json)]);
}

async function seedMinePlanner() {
    const json = loadJSON("mine_planner.json");
    await pool.execute(`INSERT INTO mine_planner_raw (raw_json) VALUES (?)`, [
        JSON.stringify(json)
    ]);
}

async function seedShipping() {
    const json = loadJSON("shipping_planner.json");
    await pool.execute(`INSERT INTO shipping_planner_raw (raw_json) VALUES (?)`, [
        JSON.stringify(json)
    ]);
}

async function seedChat() {
    const json = loadJSON("chatbox.json");
    await pool.execute(`INSERT INTO ai_chat_raw (raw_json) VALUES (?)`, [
        JSON.stringify(json)
    ]);
}

async function seedReports() {
    const json = loadJSON("reports.json");
    await pool.execute(`INSERT INTO reports_raw (raw_json) VALUES (?)`, [
        JSON.stringify(json)
    ]);
}

async function main() {
    try {
        await seedDashboard();
        await seedMinePlanner();
        await seedShipping();
        await seedChat();
        await seedReports();
        console.log("All JSON seeded into MySQL successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
}

main();
