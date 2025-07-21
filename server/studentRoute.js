const express = require("express");
const router = express.Router();
const db = require("./db");
const multer = require("multer");
// Get all student's data
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students");
    res.json(rows);
    console.log(rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

// Get a single student id

// Create A new Student
const storage = multer.diskStorage({
  destination: "/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("photo"), async (req, res) => {
  const {
    student_id,
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
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  try {
    // Insert student into the database
    const sql = `
     INSERT INTO students 
        (student_id, first_name, middle_name, last_name, birthdate, gender, level, section,
         guardian_name, guardian_contact_number, guardian_email, address, date_enrolled, status, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [
      student_id,
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
      photo,
    ]);

    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("DB Error: ", err);
    res.status(500).json({ message: "Database Error" });
  }
});
// Update a student by ID

// Deleting a student by ID

module.exports = router;
