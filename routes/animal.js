const express = require("express");
const router = express.Router();
const pool = require("../config/db");
// Helper: Check if ID exists in category table
async function checkCategoryIdExists(id) {
  const [rows] = await pool.query("SELECT * FROM categoryType WHERE id = ?", [
    id,
  ]);
  return rows.length > 0;
}
// READ ALL
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM animal");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM animal WHERE animalID = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Animal not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const {
      animalID,
      species,
      category,
      location,
      chip,
      tatoo,
      motherclip,
      fatherclip,
      weight,
      sex,
      birthDate,
      label,
      offeredTo,
      rereservedFor,
      others,
      isActive,
      userId,
    } = req.body;
    // Check foreign keys
    if (
      !(await checkCategoryIdExists(species)) ||
      !(await checkCategoryIdExists(category)) ||
      !(await checkCategoryIdExists(location))
    ) {
      return res
        .status(400)
        .json({ error: "Invalid species, category, or location ID" });
    }

    const [result] = await pool.query(
      `INSERT INTO animal (
      animalID,
                species, category, location, chip, tatoo, motherclip, fatherclip,
                weight, sex, birthDate, label, offeredTo, rereservedFor, others,
                isActive, userId, isCreated, isUpdated
            ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        animalID,
        species,
        category,
        location,
        chip,
        tatoo,
        motherclip,
        fatherclip,
        weight,
        sex,
        birthDate,
        label,
        offeredTo,
        rereservedFor,
        others,
        isActive,
        userId,
      ]
    );
    res.status(201).json({ animalID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const {
      species,
      category,
      location,
      chip,
      tatoo,
      motherclip,
      fatherclip,
      weight,
      sex,
      birthDate,
      label,
      offeredTo,
      rereservedFor,
      others,
      isActive,
      userId,
    } = req.body;

    // Check foreign keys if provided
    if (
      (species && !(await checkCategoryIdExists(species))) ||
      (category && !(await checkCategoryIdExists(category))) ||
      (location && !(await checkCategoryIdExists(location)))
    ) {
      return res
        .status(400)
        .json({ error: "Invalid species, category, or location ID" });
    }

    const [result] = await pool.query(
      `UPDATE animal SET
                species = ?, category = ?, location = ?, chip = ?, tatoo = ?, motherclip = ?, fatherclip = ?,
                weight = ?, sex = ?, birthDate = ?, label = ?, offeredTo = ?, rereservedFor = ?, others = ?,
                isActive = ?, userId = ?, isUpdated = NOW()
            WHERE animalID = ?`,
      [
        species,
        category,
        location,
        chip,
        tatoo,
        motherclip,
        fatherclip,
        weight,
        sex,
        birthDate,
        label,
        offeredTo,
        rereservedFor,
        others,
        isActive,
        userId,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Animal not found" });
    res.json({ message: "Animal updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM animal WHERE animalID = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Animal not found" });
    res.json({ message: "Animal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
