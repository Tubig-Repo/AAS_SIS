const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    req.user = user; // Attach user info to the request
    next();
  });
}

module.exports = verifyAdmin;
