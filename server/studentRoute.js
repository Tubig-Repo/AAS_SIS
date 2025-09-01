const express = require("express");
const router = express.Router();
const db = require("./db");
const multer = require("multer");
const path = require("path");

// Get all student's data
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students");
    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

//Get Academic Years

router.get("/academic-years", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM academic_years");
    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

// Get a single student id

// Using Multer for storing photos
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
// Creating a new Student
router.post("/", upload.single("photo"), async (req, res) => {
  console.log("POST uploaded file:", req.file);
  console.log("POST Body Request:", req.body);

  const {
    student_id,
    academic_year_id,
    LRN,
    first_name,
    middle_name,
    last_name,
    birthdate,
    gender,
    level,
    section,
    guardian_name,
    guardian_contact_number,
    guardian_email,
    address,
    date_enrolled,
    status,
    payment_plan,
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  // Add this detailed logging
  console.log("Extracted values:", {
    student_id,
    academic_year_id,
    LRN,
    first_name,
    middle_name,
    last_name,
    birthdate,
    gender,
    level,
    section,
    guardian_name,
    guardian_contact_number,
    guardian_email,
    address,
    date_enrolled,
    status,
    payment_plan,
    photo,
  });

  try {
    const sql = `
  INSERT INTO students 
    (student_id, academic_year_id, LRN, first_name, middle_name, last_name, birthdate, gender, level, section,
     guardian_name, guardian_contact_number, guardian_email, address, date_enrolled, status, payment_plan, photo)
  VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      student_id,
      academic_year_id,
      LRN,
      first_name,
      middle_name,
      last_name,
      birthdate,
      gender,
      level,
      section,
      guardian_name,
      guardian_contact_number,
      guardian_email,
      address,
      date_enrolled,
      status,
      payment_plan,
      photo,
    ];

    console.log("SQL Query:", sql);
    console.log("Values being inserted:", values);

    await db.query(sql, values);

    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("DB Error Details: ", err);
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    res.status(500).json({
      message: "Database Error",
      error: err.message, // Include error details for debugging
    });
  }
});
/* ===================== end of creating a student ======================*/
// Update a student by ID
router.put("/:id", upload.single("photo"), async (req, res) => {
  const studentId = req.params.id;
  console.log(req.body);
  const {
    LRN,
    academic_year_id,
    first_name,
    middle_name,
    last_name,
    birthdate,
    gender,
    level,
    section,
    guardian_name,
    guardian_contact_number,
    guardian_email,
    address,
    date_enrolled,
    status,
    payment_plan,
  } = req.body;

  const photo = req.file ? req.file.filename : req.body.photo; // Keep old photo if not replaced
  try {
    const sql = `
      UPDATE students SET
        LRN = ?,
        academic_year_id = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        birthdate = ?,
        gender = ?,
        level = ?,
        section = ?,
        guardian_name = ?,
        guardian_contact_number = ?,
        guardian_email = ?,
        address = ?,
        date_enrolled = ?,
        status = ?,
        payment_plan = ?,
        photo = ?
      WHERE student_id = ?`;

    const values = [
      LRN,
      academic_year_id,
      first_name,
      middle_name,
      last_name,
      birthdate,
      gender,
      level,
      section,
      guardian_name,
      guardian_contact_number,
      guardian_email,
      address,
      date_enrolled,
      status,
      payment_plan,
      photo,
      studentId,
    ];

    await db.query(sql, values);

    res.status(200).json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Database Error during update" });
  }
});

// Deleting a student by ID

module.exports = router;
