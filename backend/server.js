require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express(); // ✅ doit être déclaré avant tout .use()

// ✅ Middleware CORS simplifié pour développement
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ JSON parser
app.use(express.json());

// ✅ Connexion DB
const db = require('./db');

console.log("JWT_SECRET:", process.env.JWT_SECRET); 

// ✅ Import des routes
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const productRoutes = require('./routes/product.routes');
const groupOrderRoutes = require('./routes/grouporder.routes');
const needRoutes = require('./routes/need.routes');
const orderRoutes = require('./routes/order.routes');
const groupParticipationRoutes = require('./routes/groupParticipation.routes');
const reviewRoutes = require('./routes/review.routes');
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');
const groupOrderValidationRoutes = require('./routes/grouporder.validation.routes');
const groupRoutes = require('./routes/groupRoutes');
const copilotRoutes = require('./routes/copilot.routes');
const buyerRoutes = require('./routes/buyer.routes');
const sellerRoutes = require('./routes/seller.routes');
const { connectToDatabase } = require('./db');


console.log('groupOrderValidationRoutes:', groupOrderValidationRoutes);
// ✅ Utilisation des routes API


app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/grouporder', groupOrderRoutes);
app.use('/api/needs', needRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/groupparticipation', groupParticipationRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/grouporders', groupOrderValidationRoutes); 

app.use('/api/groups', groupRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/buyer', buyerRoutes); 
app.use('/api/seller', sellerRoutes);
app
// ✅ Route test
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Connexion réussie entre React et Backend !' });
});

// ✅ Serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});
