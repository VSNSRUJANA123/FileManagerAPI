// matingID;
// species;
// tatoo;
// maleChipID;
// femaleChipID;
// entryDate;
// exitDate;
// BD;
// LD;
// W;
// isHeatedDetectedANDNotMated;
// MatingconfirmedDate;
// EsitmatedDate;
// RealBirthDate;
// otherproblemenss;
// userId;
// isCreated;
// isUpdated

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// READ ALL
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM mating");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM mating WHERE matingID = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const {
      matingID,
      species,
      tatoo,
      maleChipID,
      femaleChipID,
      entryDate,
      exitDate,
      BD,
      LD,
      W,
      otherproblemenss,
      isHeatedDetectedANDNotMated,
      MatingconfirmedDate,
      EsitmatedDate,
      RealBirthDate,
      countconfdatees,
      userId,
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO mating (
                matingID, species, tatoo, maleChipID, femaleChipID, entryDate, exitDate, BD, LD, W, otherproblemenss,
                isHeatedDetectedANDNotMated, MatingconfirmedDate, EsitmatedDate, RealBirthDate, countconfdatees, userId,
                createdDate, updatedDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        matingID,
        species,
        tatoo,
        maleChipID,
        femaleChipID,
        entryDate,
        exitDate,
        BD,
        LD,
        W,
        otherproblemenss,
        isHeatedDetectedANDNotMated,
        MatingconfirmedDate,
        EsitmatedDate,
        RealBirthDate,
        countconfdatees,
        userId,
      ]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const {
      species,
      tatoo,
      maleChipID,
      femaleChipID,
      entryDate,
      exitDate,
      BD,
      LD,
      W,
      otherproblemenss,
      isHeatedDetectedANDNotMated,
      MatingconfirmedDate,
      EsitmatedDate,
      RealBirthDate,
      countconfdatees,
      userId,
    } = req.body;

    const [result] = await db.execute(
      `UPDATE mating SET
                species=?, tatoo=?, maleChipID=?, femaleChipID=?, entryDate=?, exitDate=?, BD=?, LD=?, W=?, otherproblemenss=?,
                isHeatedDetectedANDNotMated=?, MatingconfirmedDate=?, EsitmatedDate=?, RealBirthDate=?, countconfdatees=?, userId=?,
                updatedDate=NOW()
            WHERE matingID=?`,
      [
        species,
        tatoo,
        maleChipID,
        femaleChipID,
        entryDate,
        exitDate,
        BD,
        LD,
        W,
        otherproblemenss,
        isHeatedDetectedANDNotMated,
        MatingconfirmedDate,
        EsitmatedDate,
        RealBirthDate,
        countconfdatees,
        userId,
        req.params.id,
      ]
    );
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM mating WHERE matingID = ?", [
      req.params.id,
    ]);
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
