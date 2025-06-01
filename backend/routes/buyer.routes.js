const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 GET besoins de l'utilisateur
router.get('/needs', (req, res) => {
  const userId = req.query.userId;
  const sql = 'SELECT * FROM needs WHERE userId = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🔹 GET groupes rejoints
router.get('/group/joined', (req, res) => {
  const userId = req.query.userId;
  const sql = `
    SELECT g.* FROM groupparticipation gp
    JOIN grouporder g ON gp.orderId = g.orderId
    WHERE gp.userId = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🔹 GET commandes
router.get('/orders', (req, res) => {
  const userId = req.query.userId;
  const sql = 'SELECT * FROM payment WHERE userId = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});



module.exports = router;
