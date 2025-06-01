const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// 📍 POST /api/needs : exprimer un besoin
router.post('/', verifyToken, (req, res) => {
  const userId = req.user.userId;
  const { productName, description, quantity } = req.body;

  if (!productName || !description || !quantity) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const sql = `INSERT INTO needs (userId, productName, description, quantity) VALUES (?, ?, ?, ?)`;


  db.query(sql, [userId, productName, description, quantity], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Besoin enregistré avec succès." });
  });
});

// 📍 GET /api/needs : consulter tous les besoins
router.get('/', (req, res) => {
const sql = `SELECT n.*
             FROM needs n 
             JOIN user u ON n.userId = u.userId 
             ORDER BY n.needId DESC`;


  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
});


module.exports = router;
