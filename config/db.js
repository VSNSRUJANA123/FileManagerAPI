const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();
const createDBPool = () => {
  return mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    waitForConnections: true,
    connectionLimit: 10, // ✅ Controls concurrent connections
    queueLimit: 0, // ✅ Unlimited queue (better for high load)
    connectTimeout: 10000, // ✅ Prevents infinite waiting
    enableKeepAlive: true, // ✅ Keeps connections alive longer
    keepAliveInitialDelay: 10000, // ✅ Delay before the first keep-alive ping
    multipleStatements: false, // ✅ Prevents SQL injection risks
  });
};
let db = createDBPool();

// 🔄 **Auto-Reconnect Handling**
const handleDBError = async (err) => {
  console.error("❌ Database error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
    console.warn("⚠️ Connection lost. Reconnecting...");
    db = createDBPool(); // ✅ Create a new pool on failure
  }
};

db.on("error", handleDBError);
const checkDBConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully.");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
};

checkDBConnection();
module.exports = db;
