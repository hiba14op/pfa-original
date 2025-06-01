const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant!" });

  }
  if (!authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ message: "Format du token invalide!" });
}

  const token = authHeader.split(" ")[1]; // Format : "Bearer xxxxx"

  jwt.verify(token, process.env.JWT_SECRET , (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" , error: err.message });
    }

    req.user = decoded; // Le token contient userId, email, etc.
    next(); // Autorisé à continuer
  });
}

module.exports = verifyToken;
