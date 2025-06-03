const express = require('express');
const router = express.Router();
const db = require('../db')();



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
  const sql = `
    SELECT 
      orderId AS id,
      productName,
      amount AS totalAmount,
      status,
      orderDate AS date,
      deliveryAddress
    FROM orders
    WHERE userId = ?;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    const orders = results.map(order => {
      return {
        ...order,
        productName: order.productName || "Non spécifié"
      };
    });
    res.json(orders);
  });
});
// 🔹 GET stats tableau de bord acheteur

const verifyToken = require('../middleware/auth');

// 📊 Statistiques acheteur
router.get('/dashboard', verifyToken, (req, res) => {
  const buyerId = req.user.userId;
  console.log("✅ [GET /dashboard] buyerId =", buyerId);

  const stats = { activeGroups: 0, totalOrders: 0, pendingNeeds: 0 };

  console.log("🔍 Étape 1 : Groupes rejoints...");
  db.query(
    'SELECT COUNT(*) AS count FROM groupparticipation WHERE userId = ?',
    [buyerId],
    (err, result1) => {
      if (err) {
        console.error("❌ Erreur groupes acheteur :", err);
        return res.status(500).json({ error: err });
      }
      stats.activeGroups = result1[0].count;

      console.log("🔍 Étape 2 : Commandes passées...");
      db.query(
        'SELECT COUNT(*) AS count FROM orders WHERE userId = ?',
        [buyerId],
        (err, result2) => {
          if (err) {
            console.error("❌ Erreur commandes acheteur :", err);
            return res.status(500).json({ error: err });
          }
          stats.totalOrders = result2[0].count;

          console.log("🔍 Étape 3 : Besoins en attente...");
          db.query(
            'SELECT COUNT(*) AS count FROM needs WHERE userId = ? AND status = "en attente"',
            [buyerId],
            (err, result3) => {
              if (err) {
                console.error("❌ Erreur besoins acheteur :", err);
                return res.status(500).json({ error: err });
              }
              stats.pendingNeeds = result3[0].count;

              console.log("✅ Statistiques acheteur :", stats);
              res.json(stats);
            }
          );
        }
      );
    }
  );
});

module.exports = router;






