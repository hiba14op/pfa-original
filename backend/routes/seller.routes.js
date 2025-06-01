const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// 📊 Route pour récupérer les statistiques d'un vendeur
router.get('/stats', verifyToken, (req, res) => {
  const sellerId = req.user.userId;

  const stats = {
    products: 0,
    orders: 0,
    revenue: 0,
    groups: 0,
  };
  

  // 🟣 1. Compter les produits
  db.query('SELECT COUNT(*) AS count FROM product WHERE supplierId = ?', [sellerId], (err, result1) => {
    if (err) return res.status(500).json({ error: err });

    stats.products = result1[0].count;

    // 🟢 2. Compter les commandes
    db.query('SELECT COUNT(*) AS count FROM orders WHERE supplierId = ?', [sellerId], (err, result2) => {
      if (err) return res.status(500).json({ error: err });

      stats.orders = result2[0].count;

      // 🟡 3. Somme des revenus
      db.query('SELECT SUM(totalAmount) AS total FROM orders WHERE supplierId = ?', [sellerId], (err, result3) => {
        if (err) return res.status(500).json({ error: err });

        stats.revenue = result3[0].total || 0;

      // 🔵 4. Compter les groupes créés par ce vendeur
        db.query('SELECT COUNT(*) AS count FROM grouporder WHERE userId = ?', [sellerId], (err, result4) => {
         if (err) return res.status(500).json({ error: err });

         stats.groups = result4[0].count;


        // ✅ Réponse finale unique
        res.json(stats);
        });
      });
    });
  });
});


router.get('/my-groups', verifyToken, (req, res) => {
  const sellerId = req.user.userId;

  const sql = `
    SELECT id, productName, maxGroupSize, status, endDate
    FROM grouporder
    WHERE userId = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [sellerId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des groupes :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

router.delete('/group/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const sellerId = req.user.userId;

  const sql = `DELETE FROM grouporder WHERE id = ? AND userId = ?`;

  db.query(sql, [groupId, sellerId], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Groupe introuvable ou accès refusé" });
    }

    res.json({ message: "Groupe supprimé avec succès" });
  });
});

router.put('/group/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const sellerId = req.user.userId;
  const { productName, maxGroupSize, status, endDate } = req.body;

  const sql = `
    UPDATE grouporder 
    SET productName = ?, maxGroupSize = ?, status = ?, endDate = ?
    WHERE id = ? AND userId = ?
  `;

  db.query(sql, [productName, maxGroupSize, status, endDate, groupId, sellerId], (err, result) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    res.json({ message: "Groupe modifié avec succès" });
  });
});

router.get('/group/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const sellerId = req.user.userId;

  const sql = `
    SELECT * FROM grouporder 
    WHERE id = ? AND userId = ?
  `;

  db.query(sql, [groupId, sellerId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });

    if (results.length === 0) {
      return res.status(404).json({ error: "Groupe non trouvé ou non autorisé" });
    }

    res.json(results[0]);
  });
});


router.post('/groups', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  const {
    title,
    category,
    originalPrice,
    minParticipants,
    maxParticipants,
    endDate,
    features,
    priceBreakdown
  } = req.body;

  const sql = `
    INSERT INTO grouporder 
    (userId, productName, category, originalPrice, minGroupSize, maxGroupSize, endDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [sellerId, title, category, originalPrice, minParticipants, maxParticipants, endDate], (err, result) => {
    if (err) {
      console.error("Erreur SQL création groupe :", err);
      return res.status(500).json({ error: "Erreur lors de la création du groupe" });
    }

    const groupId = result.insertId;

    // Insertion des caractéristiques
    if (Array.isArray(features)) {
      features.forEach((feat) => {
        const featSQL = `INSERT INTO group_features (groupId, feature) VALUES (?, ?)`;
        db.query(featSQL, [groupId, feat]);
      });
    }

    // Insertion des tranches de prix
    if (Array.isArray(priceBreakdown)) {
      priceBreakdown.forEach((tier) => {
        const tierSQL = `INSERT INTO pricing_tiers (groupId, rangeLabel, price) VALUES (?, ?, ?)`;
        db.query(tierSQL, [groupId, tier.participants, tier.price]);
      });
    }

    res.status(201).json({ message: "Groupe créé avec succès", groupId });
  });
});

router.get('/group/:id/details', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const sellerId = req.user.userId;

  const groupSql = `SELECT * FROM grouporder WHERE orderId = ? AND userId = ?`;
  db.query(groupSql, [groupId, sellerId], (err, groupResults) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    if (groupResults.length === 0) return res.status(404).json({ error: "Groupe non trouvé" });

    const group = groupResults[0];

    // 🔍 Charger les features
    db.query(`SELECT feature FROM group_features WHERE groupId = ?`, [groupId], (err, featuresResults) => {
      if (err) return res.status(500).json({ error: "Erreur chargement caractéristiques" });

      // 🔍 Charger les prix
      db.query(`SELECT rangeLabel, price FROM pricing_tiers WHERE groupId = ?`, [groupId], (err, pricingResults) => {
        if (err) return res.status(500).json({ error: "Erreur chargement tarification" });

        res.json({
          ...group,
          features: featuresResults.map(f => f.feature),
          pricing: pricingResults
        });
      });
    });
  });
});
module.exports = router;