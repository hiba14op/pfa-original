const express = require('express');
const router = express.Router(); // ✅ cette ligne doit être AVANT toute utilisation
const db = require('../db');
const verifyToken = require('../middleware/auth');
const axios = require('axios'); // Ajout de l'importation d'axios
// 🔹 Créer une commande groupée
router.post('/', verifyToken, (req, res) => {
  const {
    status,
    totalAmount,
    supplierId,
    maxGroupSize,
    minGroupSize,
    deliveryAddress,
    image, // ✅ on récupère l'image du body
    productName
  } = req.body;

  const userId = req.user.userId;

  const sql = `
    INSERT INTO grouporder 
    (status, totalAmount, supplierId, maxGroupSize, minGroupSize, currentGroupSize, deliveryAddress, userId, image) 
    VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`;

  db.query(
    sql,
    [status, totalAmount, supplierId, maxGroupSize, minGroupSize, deliveryAddress, userId, image],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Groupe créé avec succès" });
    }
  );
});

// 🔹 Voir les groupes disponibles
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.userId; // Récupérer l'utilisateur connecté

  const sql = `
    SELECT g.*, 
           CASE 
             WHEN gp.userId IS NOT NULL THEN 1 
             ELSE 0 
           END AS isJoined
    FROM grouporder g
    LEFT JOIN groupparticipation gp ON g.orderId = gp.orderId AND gp.userId = ?
    WHERE g.status = 'ouvert';
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// 🔹 Voir les détails d'un groupe
router.get('/open', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT g.*, 
           CASE 
             WHEN gp.userId IS NOT NULL THEN 1 
             ELSE 0 
           END AS isJoined
    FROM grouporder g
    LEFT JOIN groupparticipation gp ON g.orderId = gp.orderId AND gp.userId = ?
    WHERE g.status = 'ouvert';
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// 🔹 Mettre à jour un groupe
router.put('/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const { status, totalAmount, supplierId, maxGroupSize, minGroupSize, deliveryAddress, image } = req.body;

  const sql = `
    UPDATE grouporder 
    SET status = ?, totalAmount = ?, supplierId = ?, maxGroupSize = ?, minGroupSize = ?, deliveryAddress = ?, image = ? 
    WHERE orderId = ? AND userId = ?`;

  db.query(
    sql,
    [status, totalAmount, supplierId, maxGroupSize, minGroupSize, deliveryAddress, image, groupId, req.user.userId],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ message: "Groupe mis à jour avec succès" });
    }
  );
});
// 🔹 Supprimer un groupe
router.delete('/:id', verifyToken, (req, res) => {
  const groupId = req.params.id;

  const sql = `DELETE FROM grouporder WHERE orderId = ? AND userId = ?`;

  db.query(sql, [groupId, req.user.userId], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Groupe supprimé avec succès" });
  });
});

// 🔹 Voir les groupes auxquels l'utilisateur participe
router.get('/MesGroupes', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT g.*, u.username
    FROM grouporder g 
    JOIN Groupparticipation p ON g.orderId = p.orderId 
    JOIN user u ON g.userId = u.userId 
    WHERE p.userId = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// 🔹 Rejoindre un groupe
router.post('/:id/join', verifyToken, (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.userId;

  const checkSql = `SELECT * FROM grouporder WHERE orderId = ? AND status = 'ouvert'`;

  db.query(checkSql, [groupId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({ message: "Groupe non trouvé ou fermé" });
    }

    const group = results[0];

    if (group.currentGroupSize >= group.maxGroupSize) {
      return res.status(400).json({ message: "Groupe déjà complet" });
    }

    const insertSql = `INSERT INTO groupparticipation (orderId, userId) VALUES (?, ?)`;
    db.query(insertSql, [groupId, userId], (err) => {
      if (err) return res.status(500).json({ error: err });

      const updateSql = `UPDATE grouporder SET currentGroupSize = currentGroupSize + 1 WHERE orderId = ?`;
      db.query(updateSql, [groupId], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: "Vous avez rejoint le groupe avec succès" });
      });
    });
  });
});

// Exemple d'utilisation d'axios pour récupérer les groupes ouverts
// ⚠️ Ce code ne doit pas être exécuté côté backend car localStorage n'existe que dans le navigateur.
// axios.get('http://localhost:5000/api/grouporder/open', {
//   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
// })
//   .then((response) => {
//     console.log('Groupes récupérés :', response.data);
//   })
//   .catch((error) => {
//     console.error('Erreur lors de la récupération des groupes :', error.response?.data || error.message);
//   });

module.exports = router;

