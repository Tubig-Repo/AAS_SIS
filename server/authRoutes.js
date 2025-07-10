const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyAdmin = require("./middleware/verifyAdmin");
require("dotenv").config();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // JWT Secret TOken
  const secret = process.env.JWT_SECRET;
  try {
    // Fetch USER Data from the DB
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    // Check if User Exists
    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }
    const user = rows[0];
    // Hasehed password checking if match
    const passwordMatch = await bcrypt.compare(password, user.password);
    // If Not  - Dont Authenticate
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT with role info
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret, // Use env variable in production
      { expiresIn: "1h" }
    );

    // If Authenticated
    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
