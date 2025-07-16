const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret"; // Replace with your own secret key

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from the "Bearer" header

  if (token == null) return res.status(401).json({ message: "No token" }); // No token provided

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid access token" }); // Token is no longer valid

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
