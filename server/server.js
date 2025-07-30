const express = require("express");
const cors = require("cors");
const authRoutes = require("./authRoutes");
const bcrypt = require("bcrypt");
const adminRoutes = require("./adminRoutes");
const studentRoutes = require("./studentRoute");
const app = express();
const db = require("./db");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Mount Routes
app.use("/api/auth", authRoutes);
// Admin Routes
app.use("/api/admin", adminRoutes);
// Student Routes
app.use("/api/students", studentRoutes);
app.use("/uploads", express.static("uploads"));
app.listen(5000, () => console.log("Server running on http://localhost:5000"));

// ✅ Admin Seeder (Run only once)
// async function seedAdminAccount() {
//   const username = "admin";
//   const password = "adminpassword"; // Change this before production
//   const role = "admin";

//   try {
//     const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
//       username,
//     ]);
//     if (rows.length > 0) {
//       console.log("Admin account already exists.");
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await db.query(
//       "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
//       [username, hashedPassword, role]
//     );
//     console.log("Admin account seeded successfully.");
//   } catch (err) {
//     console.error("Error seeding admin account:", err);
//   }
// }

// seedAdminAccount();
