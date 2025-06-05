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
async function getNextAnimalId() {
  const [rows] = await pool.query("SELECT MAX(animalID) AS maxId FROM animal");

  let next;
  if (!rows[0].maxId) {
    next = "0000100000000000";
  } else {
    next = (BigInt(rows[0].maxId) + 1n).toString().padStart(16, "0");
  }

  return next;
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
      matingID,
      status,
    } = req.body;
    // Check foreign keys
    const animalID = await getNextAnimalId();
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
                isActive, userId, isCreated, isUpdated, matingID,status
            ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(),?,?)`,
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
        matingID,
        status,
      ]
    );
    res.status(201).json({
      message: "Animal created",
      data: {
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
        status,
      },
    });
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
      matingID,
      status,
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
                isActive = ?, userId = ?, isUpdated = NOW(), matingID=?,
     status=?
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
        matingID,
        status,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Animal not found" });
    res.json({ message: "Animal Updated" });
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
