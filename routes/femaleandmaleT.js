const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM compatibleMalesandFemale");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM compatibleMalesandFemale WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
async function getNextId() {
  const [rows] = await pool.query(
    "SELECT MAX(id) as maxId FROM compatibleMalesandFemale"
  );
  return rows[0].maxId ? Math.max(1, rows[0].maxId + 1) : 1;
}

router.post("/", async (req, res) => {
  try {
    const { FemaleT, MaleT, user, isActive } = req.body;
    const id = await getNextId();
    const [result] = await pool.query(
      `INSERT INTO compatibleMalesandFemale (id,FemaleT, MaleT, createdDate, updateDate, user, isActive)
             VALUES (?,?, ?, NOW(), NOW(), ?, ?)`,
      [id, FemaleT, MaleT, user, isActive]
    );
    res.status(201).json({
      message: "data added",
      data: { id, FemaleT, MaleT, user, isActive },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { FemaleT, MaleT, user, isActive } = req.body;
    const [result] = await pool.query(
      `UPDATE compatibleMalesandFemale SET FemaleT = ?, MaleT = ?, updateDate = NOW(), user = ?, isActive = ? WHERE id = ?`,
      [FemaleT, MaleT, user, isActive, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "data not found" });
    }
    res.json({
      message: "data updated successfully",
      data: { id, FemaleT, MaleT, user, isActive },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM compatibleMalesandFemale WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "data not found" });
    }
    res.json({ message: "data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
