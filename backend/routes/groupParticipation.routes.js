const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// POST /api/groupParticipation/:orderId/join — Rejoindre un groupe d’achat
router.post('/:orderId/join', verifyToken, (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user?.userId;

  console.log("🔍 Tentative de rejoindre groupe");
  console.log("👉 Reçu : orderId =", orderId, "| userId =", userId);

  if (!userId || !orderId) {
    return res.status(400).json({ message: "Paramètres manquants" });
  }

  // 1. Vérifier si le groupe existe et est ouvert
  const checkGroupSql = `SELECT * FROM grouporder WHERE orderId = ? AND status = 'ouvert'`;

  db.query(checkGroupSql, [orderId], (err, results) => {
    if (err) {
      console.error("❌ Erreur SQL (groupe) :", err);
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      console.log("🚫 Groupe non trouvé ou fermé");
      return res.status(404).json({ message: "Groupe non trouvé ou fermé" });
    }

    const group = results[0];
    console.log("✅ Groupe trouvé :", group);

    // 2. Vérifier si le groupe est plein
    if (group.currentGroupSize >= group.maxGroupSize) {
      console.log("🚫 Groupe complet");
      return res.status(400).json({ message: "Groupe déjà complet" });
    }

    // 3. Vérifier si utilisateur a déjà rejoint ce groupe
    const checkParticipationSql = `SELECT * FROM groupparticipation WHERE orderId = ? AND userId = ?`;

    db.query(checkParticipationSql, [orderId, userId], (err, participation) => {
      if (err) {
        console.error("❌ Erreur SQL (vérif participation) :", err);
        return res.status(500).json({ error: err });
      }

      if (participation.length > 0) {
        console.log("⚠️ Déjà membre du groupe");
        return res.status(400).json({ message: "Vous avez déjà rejoint ce groupe" });
      }

      // 4. Ajouter la participation
      const insertParticipationSql = `INSERT INTO groupparticipation (orderId, userId) VALUES (?, ?)`;

      db.query(insertParticipationSql, [orderId, userId], (err) => {
        if (err) {
          console.error("❌ Erreur SQL (insert participation) :", err);
          return res.status(500).json({ error: err });
        }

        console.log("✅ Participation ajoutée avec succès");

        // 5. Incrémenter la taille du groupe
        const updateGroupSql = `UPDATE grouporder SET currentGroupSize = currentGroupSize + 1 WHERE orderId = ?`;

        db.query(updateGroupSql, [orderId], (err) => {
          if (err) {
            console.error("❌ Erreur SQL (update groupe) :", err);
            return res.status(500).json({ error: err });
          }

          console.log("✅ Taille du groupe mise à jour");
          console.log("✅ Taille du groupe mise à jour");

// 6. Enregistrer une commande dans orderitem
const getProductInfoSql = `SELECT productName, totalAmount FROM grouporder WHERE orderId = ?`;
db.query(getProductInfoSql, [orderId], (err, rows) => {
  if (err) {
    console.error("❌ Erreur SQL (récup produit):", err);
    return res.status(500).json({ error: err });
  }

  const { productName, totalAmount } = rows[0];

  const insertOrderSql = `INSERT INTO orderitem (orderId, userId, productName, quantity, unitPrice, status) VALUES (?, ?, ?, ?, ?, 'en cours')`;

  db.query(insertOrderSql, [orderId, userId, productName, 1, totalAmount], (err) => {
    if (err) {
      console.error("❌ Erreur SQL (ajout commande):", err);
      return res.status(500).json({ error: err });
    }

    console.log("✅ Commande ajoutée dans orderitem");
    return res.status(200).json({ message: "Vous avez rejoint le groupe et la commande a été enregistrée !" });
  });
});

          return res.status(200).json({ message: "Vous avez rejoint le groupe avec succès" });
        });
        
      });
    });
  });
});

module.exports = router;
