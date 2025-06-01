const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// 📊 Statistiques vendeur
router.get('/stats', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  const stats = { products: 0, orders: 0, revenue: 0, groups: 0 };

  db.query('SELECT COUNT(*) AS count FROM product WHERE supplierId = ?', [sellerId], (err, result1) => {
    if (err) return res.status(500).json({ error: err });
    stats.products = result1[0].count;

    db.query('SELECT COUNT(*) AS count FROM orders WHERE supplierId = ?', [sellerId], (err, result2) => {
      if (err) return res.status(500).json({ error: err });
      stats.orders = result2[0].count;

      db.query('SELECT SUM(totalAmount) AS total FROM orders WHERE supplierId = ?', [sellerId], (err, result3) => {
        if (err) return res.status(500).json({ error: err });
        stats.revenue = result3[0].total || 0;

        db.query('SELECT COUNT(*) AS count FROM grouporder WHERE supplierId = ?', [sellerId], (err, result4) => {
          if (err) return res.status(500).json({ error: err });
          stats.groups = result4[0].count;
          res.json(stats);
        });
      });
    });
  });
});

// 🔍 Mes groupes créés
router.get('/my-groups', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  const sql = `SELECT orderId AS id, productName, maxGroupSize, status, endDate FROM grouporder WHERE supplierId = ? ORDER BY created_at DESC`;
  db.query(sql, [sellerId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

// ❌ Supprimer un groupe
router.delete('/group/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const sellerId = req.user.userId;
  db.query('DELETE FROM grouporder WHERE orderId = ? AND supplierId = ?', [groupId, sellerId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Groupe introuvable' });
    res.json({ message: 'Groupe supprimé avec succès' });
  });
});

// ✏️ Modifier un groupe
router.put('/group/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const sellerId = req.user.userId;
  const { productName, maxGroupSize, status, endDate } = req.body;
  const sql = `UPDATE grouporder SET productName = ?, maxGroupSize = ?, status = ?, endDate = ? WHERE orderId = ? AND supplierId = ?`;
  db.query(sql, [productName, maxGroupSize, status, endDate, groupId, sellerId], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Groupe modifié avec succès' });
  });
});

// 👁️ Détails d'un groupe
router.get('/group/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const sellerId = req.user.userId;
  const sql = `SELECT * FROM grouporder WHERE orderId = ? AND supplierId = ?`;
  db.query(sql, [groupId, sellerId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (results.length === 0) return res.status(404).json({ error: 'Groupe non trouvé' });
    res.json(results[0]);
  });
});

// ➕ Créer un groupe + produit
router.post('/groups', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  const { title, category, originalPrice, minParticipants, maxParticipants, endDate, features, priceBreakdown } = req.body;

  const productSQL = `INSERT INTO product (name, description, unitPrice, stockQuantity, isAvailable, supplierId) VALUES (?, ?, ?, ?, ?, ?)`;
  const productValues = [title, 'Produit lié au groupe', originalPrice, 10, 1, sellerId];

  db.query(productSQL, productValues, (err, productResult) => {
    if (err) return res.status(500).json({ error: "Erreur insertion produit" });
    const productId = productResult.insertId;

    const groupSQL = `INSERT INTO grouporder (supplierId, productName, category, originalPrice, minGroupSize, maxGroupSize, endDate, productId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(groupSQL, [sellerId, title, category, originalPrice, minParticipants, maxParticipants, endDate, productId], (err, groupResult) => {
      if (err) return res.status(500).json({ error: "Erreur création groupe" });
      const groupId = groupResult.insertId;

      if (Array.isArray(features)) {
        features.forEach(f => db.query(`INSERT INTO group_features (groupId, feature) VALUES (?, ?)`, [groupId, f]));
      }
      if (Array.isArray(priceBreakdown)) {
        priceBreakdown.forEach(t => db.query(`INSERT INTO pricing_tiers (groupId, rangeLabel, price) VALUES (?, ?, ?)`, [groupId, t.participants, t.price]));
      }

      res.status(201).json({ message: "Groupe et produit créés avec succès", groupId });
    });
  });
});

// 📦 Produits du vendeur
router.get('/products', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  const sql = `SELECT productId, name, description, unitPrice, stockQuantity, isAvailable FROM product WHERE supplierId = ?`;
  db.query(sql, [sellerId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.json(results);
  });
});

module.exports = router;
