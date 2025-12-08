import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "minewise",
});

export default pool;

pool.getConnection()
  .then(() => console.log("DB CONNECTED ✓"))
  .catch(err => console.log("DB ERROR:", err));
