const express = require("express");
const router = express.Router();
const db = require("./db");
// Get all student's data
router.get("/" , async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students")
        res.json(rows);
        console.log(rows);
    }catch(err) {
        console.error("DB Error:", err);
        res.status(500).json({message: "Database Error"});
    }
})

// Get a single student id 

// Create A new Student 

// Update a student by ID 

// Deleting a student by ID 


module.exports = router;