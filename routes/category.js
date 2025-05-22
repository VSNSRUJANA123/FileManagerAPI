const express = require("express");
const router = express.Router();
const db = require("../config/db");

async function getNextId() {
  const [rows] = await db.query("SELECT MAX(id) as maxId FROM category");
  return rows[0].maxId ? rows[0].maxId + 1 : 100;
}
// READ ALL
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM category");
    return res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM category WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  try {
    const { categoryName, description, isActive, userId } = req.body;
    const id = await getNextId();
    const isCreated = new Date();
    const isUpdated = new Date();
    await db.execute(
      "INSERT INTO category (id, categoryName, description, isActive, userId, isCreated, isUpdated) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, categoryName, description, isActive, userId, isCreated, isUpdated]
    );
    res.status(201).json({
      message: "category added",
      data: {
        id,
        categoryName,
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
    const { categoryName, description, isActive, userId } = req.body;
    const isUpdated = new Date();
    const [result] = await db.execute(
      "UPDATE category SET categoryName=?, description=?, isActive=?, userId=?, isUpdated=? WHERE id=?",
      [categoryName, description, isActive, userId, isUpdated, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Category Not found" });
    res.json({
      message: "category updated",
      data: {
        id: req.params.id,
        categoryName,
        description,
        isActive,
        userId,
        isUpdated,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM category WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Category Not found" });
    res.json({ message: "Category Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
