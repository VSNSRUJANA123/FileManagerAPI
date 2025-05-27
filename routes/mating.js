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

async function getNextMatingId() {
  const [rows] = await db.query("SELECT MAX(matingID) AS maxId FROM mating");

  let next;
  if (!rows[0].maxId) {
    next = "0000100000000000";
  } else {
    // Convert string to BigInt for safe increment
    next = (BigInt(rows[0].maxId) + 1n).toString().padStart(16, "0");
  }

  return next;
}

router.post("/", async (req, res) => {
  try {
    let {
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
      otherproblmenss,
      isHeatedDetectedANDNotMated,
      MatingconfirmedDate,
      EsitmatedDate,
      RealBirthDate,
      countconfdatees,
      userId,
    } = req.body;
    matingID = await getNextMatingId();
    const [result] = await db.execute(
      `INSERT INTO mating (
                matingID, species, tatoo, maleChipID, femaleChipID, entryDate, exitDate, BD, LD, W, otherproblmenss,
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
        otherproblmenss,
        isHeatedDetectedANDNotMated,
        MatingconfirmedDate,
        EsitmatedDate,
        RealBirthDate,
        countconfdatees,
        userId,
      ]
    );
    res.json({
      message: "mating added",
      data: {
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
        otherproblmenss,
        isHeatedDetectedANDNotMated,
        MatingconfirmedDate,
        EsitmatedDate,
        RealBirthDate,
        countconfdatees,
        userId,
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
      tatoo,
      maleChipID,
      femaleChipID,
      entryDate,
      exitDate,
      BD,
      LD,
      W,
      otherproblmenss,
      isHeatedDetectedANDNotMated,
      MatingconfirmedDate,
      EsitmatedDate,
      RealBirthDate,
      countconfdatees,
      userId,
    } = req.body;

    const [result] = await db.execute(
      `UPDATE mating SET
                species=?, tatoo=?, maleChipID=?, femaleChipID=?, entryDate=?, exitDate=?, BD=?, LD=?, W=?, otherproblmenss=?,
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
        otherproblmenss,
        isHeatedDetectedANDNotMated,
        MatingconfirmedDate,
        EsitmatedDate,
        RealBirthDate,
        countconfdatees,
        userId,
        req.params.id,
      ]
    );
    if (result.affectedRows) {
      return res.json({ message: "matingID updated" });
    }
    return res.json({ message: "matingID not found" });
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
    if (result.affectedRows === 1) {
      return res.json({ message: "matingID deleted" });
    }
    res.json({ affectedRows: "matingID not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
