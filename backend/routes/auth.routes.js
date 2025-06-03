const express = require('express');
const router = express.Router();
const db = require('../db')();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Route : POST /signup
router.post('/signup', async (req, res) => {
  const { username, email, password, phoneNumber, address, role } = req.body;

  // 🔒 Vérification des champs requis
  if (!username || !email || !password || !phoneNumber || !address || !role) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    // 🔍 Vérifier si l'email est déjà utilisé
    const checkEmail = 'SELECT * FROM user WHERE email = ?';
    db.query(checkEmail, [email], async (err, results) => {
      if (err) {
        console.error("❌ Erreur lors de la vérification d'email :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Email déjà utilisé" });
      }

      // 🔐 Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Insertion dans la base
      const sql = `
        INSERT INTO user (username, email, password, phoneNumber, address, isActive, role)
        VALUES (?, ?, ?, ?, ?, true, ?)
      `;

      db.query(sql, [username, email, hashedPassword, phoneNumber, address, role], (err, result) => {
        if (err) {
          console.error("❌ Erreur lors de l'insertion :", err);
          return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: "Utilisateur inscrit avec succès !" });
      });
    });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

// ✅ Route : POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const sql = 'SELECT * FROM user WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL :", err);
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // 🎫 Génération du token JWT
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET, // remplace par process.env.JWT_SECRET pour production
      { expiresIn: '1h' }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

module.exports = router;
