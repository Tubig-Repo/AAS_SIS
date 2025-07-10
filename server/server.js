const express = require("express");
const cors = require("cors");
const authRoutes = require("./authRoutes");
const bcrypt = require("bcrypt");
const adminRoutes = require("./adminRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);
// Admin Routes
app.use("/api/admin", adminRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
