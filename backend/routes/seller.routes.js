const express = require('express');
const router = express.Router();
const db = require('../db')();
const verifyToken = require('../middleware/auth');

// 📊 Statistiques vendeur
router.get('/stats', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  console.log("✅ [GET /stats] sellerId =", sellerId);

  const stats = { products: 0, orders: 0, revenue: 0, groups: 0 };

  console.log("🔍 Étape 1 : Récupération des produits...");
  db.query('SELECT COUNT(*) AS count FROM grouporder WHERE supplierId = ?', [sellerId], (err, result1) => {
    if (err) {
      console.error("❌ Erreur dans stats produits", err);
      return res.status(500).json({ error: err });
    }
    stats.products = result1[0].count;

    db.query(`
  SELECT COUNT(*) AS count 
  FROM orders o
  JOIN grouporder g ON o.groupId = g.orderId
  WHERE g.supplierId = ?
`, [sellerId], (err, result2) => {
  if (err) {
    console.error("❌ Erreur dans stats commandes :", err);
    return res.status(500).json({ error: err });
  }
  stats.orders = result2[0].count;
      console.log("🔍 Étape 3 : Récupération du revenu...");
      db.query(`
  SELECT SUM(o.amount) AS total 
  FROM orders o
  JOIN grouporder g ON o.groupId = g.orderId
  WHERE g.supplierId = ?
`, [sellerId], (err, result3) => {
   if (err) {
          console.error("❌ Erreur dans stats revenus", err);
          return res.status(500).json({ error: err });
        }
        stats.revenue = result3[0].total || 0;

        console.log("🔍 Étape 4 : Récupération des groupes créés...");
        db.query('SELECT COUNT(*) AS count FROM grouporder WHERE supplierId = ?', [sellerId], (err, result4) => {
          if (err) {
            console.error("❌ Erreur dans stats groupes", err);
            return res.status(500).json({ error: err });
          }
          stats.groups = result4[0].count;

          console.log("✅ Statistiques finales :", stats);
          res.json(stats);
        });
      });
    });
  });
});

// 🔍 Mes groupes créés
router.get('/my-groups', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  console.log("✅ [POST /groups] Reçu pour sellerId =", sellerId);
  console.log("📦 Données reçues dans req.body :", req.body);
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
  console.log("✅ [POST /groups] sellerId =", sellerId);
  console.log("📦 Données reçues dans req.body :", req.body);
   
  const productSQL = `INSERT INTO product (name, description, unitPrice, stockQuantity, isAvailable, supplierId) VALUES (?, ?, ?, ?, ?, ?)`;
  const productValues = [title, 'Produit lié au groupe', originalPrice, 10, 1, sellerId];

  db.query(productSQL, productValues, (err, productResult) => {
    if (err) {
      console.error("❌ Erreur insertion produit :", err); // 👈 AJOUT
      return res.status(500).json({ error: "Erreur insertion produit", details: err });
    }
    const productId = productResult.insertId;
    console.log("✅ Produit inséré, ID =", productId);
    

    const groupSQL = `INSERT INTO grouporder (supplierId, productName, category, originalPrice, minGroupSize, maxGroupSize, endDate, productId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?,'En cours')`;
    db.query(groupSQL, [sellerId, title, category, originalPrice, minParticipants, maxParticipants, endDate, productId, 'En cours'], (err, groupResult) => {
      if (err) {
        console.error("❌ Erreur création groupe :", err); // 👈 AJOUT
        return res.status(500).json({ error: "Erreur création groupe", details: err });
      }
      const groupId = groupResult.insertId;
      console.log("✅ Groupe inséré, ID =", groupId);

      if (Array.isArray(features)) {
        features.forEach(f => db.query(`INSERT INTO group_features (groupId, feature) VALUES (?, ?)`, [groupId, f]));
      }
      if (Array.isArray(priceBreakdown)) {
       priceBreakdown.forEach((tranche) => {
        console.log("👉 Insertion tier", tranche, "pour groupId =", groupId);
  const sql = `INSERT INTO pricing_tiers (groupId, rangeLabel, price) VALUES (?, ?, ?)`;
  db.query(sql, [groupId, tranche.participants, tranche.price], (err, result) => {
    if (err) {
      console.error("❌ Erreur insertion tranche :", err);
    } else {
      console.log("📊 Tranche ajoutée :", tranche);
    }
  });
});

      }

      res.status(201).json({
  message: "Groupe et produit créés avec succès ✅",
  groupId,
  productId
});

    });
  });
});

//Produits vendeur 

router.get('/my-products', verifyToken, (req, res) => {
  const sellerId = req.user.userId;

  const sql = `
    SELECT orderId AS id, productName  
    FROM grouporder 
    WHERE supplierId = ?
  `;

  db.query(sql, [sellerId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});



//orders
router.get('/orders', verifyToken, (req, res) => {
  const sellerId = req.user.userId;

  const sql = `
    SELECT o.orderId, o.productName, o.amount, o.status, o.orderDate
    FROM orders o
    JOIN grouporder g ON o.groupId = g.orderId
    WHERE g.supplierId = ?
    ORDER BY o.orderDate DESC
  `;

  db.query(sql, [sellerId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

//Settings
router.get('/profile', verifyToken, (req, res) => {
  const sellerId = req.user.userId;

  db.query(
    'SELECT username, email, phoneNumber, address FROM user WHERE userId = ?',
    [sellerId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur serveur' });
      if (results.length === 0) return res.status(404).json({ error: 'Vendeur introuvable' });

      res.json(results[0]);
    }
  );
});
router.put('/profile', verifyToken, (req, res) => {
  const sellerId = req.user.userId;
  const { username, email, phoneNumber, address } = req.body;

  const sql = `
    UPDATE user 
    SET username = ?, email = ?, phoneNumber = ?, address = ?
    WHERE userId = ?
  `;

  db.query(sql, [username, email, phoneNumber, address, sellerId], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json({ message: 'Profil mis à jour avec succès' });
  });
});
// 📊 Tarifs groupés des groupes créés
router.get('/pricing', verifyToken, (req, res) => {
  const sellerId = req.user.userId;

  const sql = `
    SELECT g.productName, pt.rangeLabel, pt.price
    FROM pricing_tiers pt
    JOIN grouporder g ON pt.groupId = g.orderId
    WHERE g.supplierId = ?
    ORDER BY g.orderId, pt.rangeLabel
  `;

  db.query(sql, [sellerId], (err, results) => {
    if (err) {
      console.error("❌ Erreur chargement tarifs groupés :", err);
      return res.status(500).json({ error: "Erreur chargement tarifs groupés" });
    }
    res.json(results);
  });
});
// ✅ Mettre à jour automatiquement les statuts des groupes
router.put('/update-statuses', (req, res) => {
  const now = new Date();

  // Clôturer les groupes expirés
  const closeQuery = `
    UPDATE grouporder 
    SET status = 'Clôturé' 
    WHERE endDate < ? AND status = 'En cours'
  `;

  // Marquer les groupes comme complets
  const fullQuery = `
    UPDATE grouporder 
    SET status = 'Complet' 
    WHERE currentGroupSize >= maxGroupSize AND status = 'En cours'
  `;

  db.query(closeQuery, [now], (err1) => {
    if (err1) return res.status(500).json({ error: 'Erreur cloture', details: err1 });

    db.query(fullQuery, (err2) => {
      if (err2) return res.status(500).json({ error: 'Erreur complet', details: err2 });

      res.json({ message: 'Statuts mis à jour automatiquement ✅' });
    });
  });
});

module.exports = router;
