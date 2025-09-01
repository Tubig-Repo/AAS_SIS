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

router.get("/tuition-rate", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT level,academic_year_id,cash_fee,installment_rate FROM tuition_fees"
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch Error", err);
    res.status(500).json({ message: "Database Error" });
  }
});
// Joining Student Table and Tuition Fee Table
router.get("/student-fees", async (req, res) => {
  try {
    const [rows] = await db.query(`
   SELECT 
    s.id AS student_id,
    s.first_name,
    s.level,
    s.payment_plan,
    s.academic_year_id,
    COALESCE(SUM(p.amount_paid), 0) AS payments_made,
    ay.year_label AS academic_year, 
    f.cash_fee,
    f.installment_rate
    FROM students s
    JOIN academic_years ay 
      ON s.academic_year_id = ay.id
    JOIN tuition_fees f 
    ON (
        (s.level = 'Kindergarten' AND f.level = 'Kinder')
        OR (s.level LIKE 'Grade%' AND f.level = 'Elementary')
    )
    AND f.academic_year_id = s.academic_year_id
    LEFT JOIN payments p 
    ON p.student_id = s.id 
    AND p.academic_year_id = s.academic_year_id  -- ensures payments are for the correct school year
    GROUP BY 
    s.id, s.first_name, s.level, s.payment_plan, ay.year_label, f.cash_fee, f.installment_rate;
    `);

    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

module.exports = router;
