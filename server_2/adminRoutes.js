const verifyAdmin = require("./middleware/verifyAdmin");
const express = require("express");
const router = express.Router();
router.get("/admin/dashboard", verifyAdmin, (req, res) => {
  res.json({
    message: `Welcome to the admin dashboard, ${req.user.username}!`,
  });
});

module.exports = router;
