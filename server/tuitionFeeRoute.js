const express = require("express");
const router = express.Router();
const db = require("./db");
const path = require("path");
const { log } = require("console");

// Edit Tuition Fee

// Fetch Student Data
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT level,academic_year_id,first_name,middle_name,last_name FROM students"
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

module.exports = router;
