const express = require("express");
const router = express.Router();
const db = require("../config/db");
router.get("/animalByChip/:chipID", async (req, res) => {
  try {
    const { chipID } = req.params;
    const [rows] = await db.query(
      `SELECT animalID FROM animal WHERE chip = ?`,
      [chipID]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "No animals found for matingID" });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/animal-by-mating/:matingID", async (req, res) => {
  try {
    const { matingID } = req.params;
    const [rows] = await db.query(
      `SELECT a.*
      FROM animal a
      JOIN mating m ON a.matingID = m.matingID
      WHERE m.matingID = ?`,
      [matingID]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "No animals found for matingID" });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// READ ALL
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM mating ORDER BY matingID desc"
    );
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
      maleTatoo,
      maleChipID,
      femaleChipID,
      entryDate,
      exitDate,
      BD,
      LD,
      W,
      isHeatedDetectedANDNotMated,
      MatingconfirmedDate1,
      EsitmatedDate,
      RealBirthDate,
      countconfdatees,
      userId,
      MatingconfirmedDate2,
      MatingconfirmedDate3,
      femaleTatoo,
      pregencyMethod,
      confirmedPergency,
      pregencyConfirmedDate,
      ACategroy,
      matingcol,
      PregnancyPreventativeTreatmentDate,
      matingcol1,
    } = req.body;

    matingID = await getNextMatingId();
    const [result] = await db.execute(
      `INSERT INTO mating (
                matingID, species, maleTatoo, maleChipID, femaleChipID, entryDate, exitDate, BD, LD, W,
                isHeatedDetectedANDNotMated, MatingconfirmedDate1, EsitmatedDate, RealBirthDate, countconfdatees, userId,
                createdDate, updatedDate,MatingconfirmedDate2, MatingconfirmedDate3,femaleTatoo,
                pregencyMethod,confirmedPergency,pregencyConfirmedDate, ACategroy,matingcol,PregnancyPreventativeTreatmentDate,matingcol1
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(),?,?,?,?,?,?,?,?,?,?)`,
      [
        matingID,
        species ?? null,
        maleTatoo ?? null,
        maleChipID ?? null,
        femaleChipID ?? null,
        entryDate ?? null,
        exitDate ?? null,
        BD ?? null,
        LD ?? null,
        W ?? null,
        isHeatedDetectedANDNotMated ?? 0,
        MatingconfirmedDate1 ?? null,
        EsitmatedDate ?? null,
        RealBirthDate ?? null,
        countconfdatees ?? 0,
        userId ?? null,
        MatingconfirmedDate2 ?? null,
        MatingconfirmedDate3 ?? null,
        femaleTatoo ?? null,
        pregencyMethod ?? null,
        confirmedPergency ?? 0,
        pregencyConfirmedDate ?? null,
        ACategroy ?? null,
        matingcol ?? null,
        PregnancyPreventativeTreatmentDate ?? null,
        matingcol1 ?? null,
      ]
    );
    res.json({
      message: "mating added",
      data: {
        matingID,
        species,
        maleTatoo,
        maleChipID,
        femaleChipID,
        entryDate,
        exitDate,
        BD,
        LD,
        W,
        isHeatedDetectedANDNotMated,
        MatingconfirmedDate1,
        EsitmatedDate,
        RealBirthDate,
        countconfdatees,
        userId,
        MatingconfirmedDate2,
        MatingconfirmedDate3,
        femaleTatoo,
        pregencyMethod,
        confirmedPergency,
        pregencyConfirmedDate,
        ACategroy,
        matingcol,
        PregnancyPreventativeTreatmentDate,
        matingcol1,
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
      maleTatoo,
      maleChipID,
      femaleChipID,
      entryDate,
      exitDate,
      BD,
      LD,
      W,
      isHeatedDetectedANDNotMated,
      MatingconfirmedDate1,
      EsitmatedDate,
      RealBirthDate,
      countconfdatees,
      userId,
      MatingconfirmedDate2,
      MatingconfirmedDate3,
      femaleTatoo,
      pregencyMethod,
      confirmedPergency,
      pregencyConfirmedDate,
      ACategroy,
      matingcol,
      PregnancyPreventativeTreatmentDate,
      matingcol1,
    } = req.body;

    const [result] = await db.execute(
      `UPDATE mating SET
                species=?, maleTatoo=?, maleChipID=?, femaleChipID=?, entryDate=?, exitDate=?, BD=?, LD=?, W=?,
                isHeatedDetectedANDNotMated=?, MatingconfirmedDate1=?, EsitmatedDate=?, RealBirthDate=?, countconfdatees=?, userId=?,
                updatedDate=NOW(),MatingconfirmedDate2=?,MatingconfirmedDate3=?,femaleTatoo=?,
      pregencyMethod=?,
      confirmedPergency=?,pregencyConfirmedDate=?, ACategroy=?,
    matingcol=?,
    PregnancyPreventativeTreatmentDate=?,
    matingcol1=?
            WHERE matingID=?`,
      [
        species ?? null,
        maleTatoo ?? null,
        maleChipID ?? null,
        femaleChipID ?? null,
        entryDate ?? null,
        exitDate ?? null,
        BD ?? null,
        LD ?? null,
        W ?? null,
        isHeatedDetectedANDNotMated ?? 0,
        MatingconfirmedDate1 ?? null,
        EsitmatedDate ?? null,
        RealBirthDate ?? null,
        countconfdatees ?? 0,
        userId ?? null,
        MatingconfirmedDate2 ?? null,
        MatingconfirmedDate3 ?? null,
        femaleTatoo ?? null,
        pregencyMethod ?? null,
        confirmedPergency ?? 0,
        pregencyConfirmedDate ?? null,
        ACategroy ?? null,
        matingcol ?? null,
        PregnancyPreventativeTreatmentDate ?? null,
        matingcol1 ?? null,
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
