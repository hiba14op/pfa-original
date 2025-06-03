const express = require('express');
const router = express.Router();
const db = require('../db')();
const verifyToken = require('../middleware/auth');


// GET /api/groupparticipation/my — Obtenir les groupes que l'utilisateur a rejoints
router.get('/my', verifyToken, (req, res) => {
  const userId = req.user.userId;

  console.log(" Récupération des groupes pour userId:", userId); // debug

  const sql = `
    SELECT g.* 
    FROM grouporder g
    JOIN groupparticipation gp ON g.orderId = gp.orderId
    WHERE gp.userId = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(" Erreur SQL (mes groupes):", err);
      return res.status(500).json({ error: err });
    }

    console.log("Groupes trouvés :", results); // debug
    return res.status(200).json(results);
  });
});


//  POST /api/groupparticipation/:orderId/join — Rejoindre un groupe d’achat
router.post('/join/:orderId', verifyToken, (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

  console.log(" Tentative de rejoindre groupe");
  console.log(" Reçu : orderId =", orderId, "| userId =", userId);

  if (!userId || !orderId) {
    return res.status(400).json({ message: "Paramètres manquants" });
  }

  // Vérifier si l'utilisateur a déjà rejoint le groupe
  const checkParticipation = `SELECT * FROM groupparticipation WHERE orderId = ? AND userId = ?`;
  db.query(checkParticipation, [orderId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length > 0) {
      return res.status(400).json({ message: "Vous avez déjà rejoint ce groupe" });
    }

    // Ajouter la participation
    const insertParticipation = `INSERT INTO groupparticipation (orderId, userId) VALUES (?, ?)`;
    db.query(insertParticipation, [orderId, userId], (err) => {
      if (err) return res.status(500).json({ error: err });

      // Incrémenter la taille du groupe
      const updateGroupSize = `UPDATE grouporder SET currentGroupSize = currentGroupSize + 1 WHERE orderId = ?`;
      db.query(updateGroupSize, [orderId], (err) => {
        if (err) return res.status(500).json({ error: err });

        res.status(200).json({ message: "Vous avez rejoint le groupe avec succès" });
      });
    });
  });
});

module.exports = router;
