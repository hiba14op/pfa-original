const express = require('express');            // ✅ d'abord
const router = express.Router();               // ✅ ensuite
const db = require('../db')();
const verifyToken = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', verifyToken, async (req, res) => {
  const { productName, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: productName,
          },
          unit_amount: amount * 100, // 💶 en centimes
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:8080/success',
      cancel_url: 'http://localhost:8080/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Erreur Stripe :", error);
    res.status(500).json({ error: 'Erreur paiement Stripe' });
  }
});




// POST /api/orders/:orderId/items — Ajouter un produit à une commande de groupe
router.post('/:orderId/items', verifyToken, (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "productId et quantity sont requis." });
  }

  const sql = `INSERT INTO Orderitem (orderItemId,orderId, userId, productId, quantity) VALUES (?,?, ?, ?, ?)`;

  db.query(sql, [orderId, userId, productId, quantity], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Produit ajouté à la commande avec succès." });
  });
});
router.post('/pay/:groupId', verifyToken, (req, res) => {
  const userId = req.user.userId;
  const groupId = req.params.groupId;

  const sql = `
    INSERT INTO orders (userId, groupId, productName, amount, status, orderDate, isPaid)
    SELECT ?, g.orderId, g.productName, g.totalAmount, 'confirmée', NOW(), TRUE
    FROM grouporder g
    WHERE g.orderId = ?
  `;

  db.query(sql, [userId, groupId], (err, result) => {
    if (err) {
      console.error("❌ Erreur lors du paiement :", err);
      return res.status(500).json({ message: "Erreur lors du paiement" });
    }

    return res.status(200).json({ message: "✅ Commande créée et payée !" });
  });
});


// GET /api/orders/:orderId/my-items — Voir les produits commandés par l’utilisateur dans ce groupe
router.get('/:orderId/my-items', verifyToken, (req, res) => {

  const orderId = req.params.orderId;
  const userId = req.user.userId;

  const sql = `
    SELECT oi.*, p.name, p.unitPrice 
    FROM Orderitem oi
    JOIN product p ON oi.productId = p.productId
    WHERE oi.orderId = ? AND oi.userId = ?
  `;

  db.query(sql, [orderId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
// GET /api/orders/my — voir toutes les commandes de l'utilisateur
router.get('/my', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT 
      o.orderId AS id,
      o.productName,
      o.amount AS totalAmount,
      o.status,
      o.orderDate AS date,
      g.deliveryAddress
    FROM orders o
    LEFT JOIN groupParticipation gp ON o.orderId = gp.orderId
    LEFT JOIN grouporder g ON o.orderId = g.orderId
    WHERE o.userId = ? OR gp.userId = ?
    ORDER BY o.orderDate DESC
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des commandes :", err);
      return res.status(500).json({ error: err });
    }
    console.log("Résultats des commandes :", results); // Ajoutez ce log
    const orders = results.map(order => {
      const productName = order.productName || "Non spécifié";
      const deliveryAddress = order.deliveryAddress || "Inconnue";
      return {
        ...order,
        productName,
        deliveryAddress
      };
    });
    res.json(orders);
  });
});


module.exports = router;
