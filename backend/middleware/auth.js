const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("⛔ Aucun token fourni");
    return res.status(401).json({ message: "Token manquant!" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("⛔ Format de token invalide :", authHeader);
    return res.status(401).json({ message: "Format du token invalide!" });
  }

  const token = authHeader.split(" ")[1]; // Format : "Bearer xxxxx"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("⛔ Token invalide :", err.message);
      return res.status(403).json({ message: "Token invalide", error: err.message });
    }

    console.log("✅ Token vérifié. Utilisateur :", decoded);
    req.user = decoded; // Le token contient userId, email, etc.
    next(); // Autorisé à continuer
  });
}

module.exports = verifyToken;
