const express = require("express");
const router = express.Router();
const pool = require("../config/db");
// Helper: Get next id starting from 100
async function getNextId() {
  const [rows] = await pool.query("SELECT MAX(id) as maxId FROM categoryType");
  return rows[0].maxId ? Math.max(1, rows[0].maxId + 1) : 1;
}

// Helper: Check if categoryId exists
async function categoryIdExists(categoryId) {
  const [rows] = await pool.query("SELECT * FROM category WHERE id = ?", [
    categoryId,
  ]);
  return rows.length > 0;
}

// READ ALL
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categoryType");
    return res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categoryType WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "categoryType Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { categoryId, name, description, isActive, userId } = req.body;
    const isCreated = new Date();
    const isUpdated = new Date();
    if (!(await categoryIdExists(categoryId))) {
      return res.status(400).json({ error: "Invalid categoryId" });
    }
    const id = await getNextId();
    await pool.query(
      `INSERT INTO categoryType (id, categoryId, name, description, isActive, userId, isCreated, isUpdated)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        categoryId,
        name,
        description,
        isActive,
        userId,
        isCreated,
        isUpdated,
      ]
    );
    return res.status(201).json({
      message: "categoryType added",
      data: {
        id,
        categoryId,
        name,
        description,
        isActive,
        userId,
        isCreated,
        isUpdated,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { categoryId, name, description, isActive, userId } = req.body;
    const isUpdated = new Date();
    if (categoryId && !(await categoryIdExists(categoryId))) {
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    const [result] = await pool.query(
      `UPDATE categoryType SET categoryId=?, name=?, description=?, isActive=?, userId=?, isUpdated=?
             WHERE id=?`,
      [
        categoryId,
        name,
        description,
        isActive,
        userId,
        isUpdated,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "categoryType Not found" });
    res.json({ message: "categoryType Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM categoryType WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "categoryType Not found" });
    res.json({ message: "categoryType Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
