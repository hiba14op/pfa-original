require('dotenv').config();

const express = require('express');
const cors = require('cors');
const copilotRoutes = require('./routes/copilot.routes'); // ✅ Déclaration unique ici
const buyerRoutes = require('./routes/buyer.routes'); // ✅ ajoute cette ligne
const ordersRoutes = require('./routes/order.routes');


const app = express();
// ✅ Middleware CORS simplifié pour développement
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
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


// ✅ Routes API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/protected', require('./routes/protected.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/grouporder', require('./routes/grouporder.routes'));
app.use('/api/needs', require('./routes/need.routes'));
app.use('/api/orders', ordersRoutes); 
app.use('/api/groupParticipation', require('./routes/groupParticipation.routes'));

app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/grouporders', require('./routes/grouporder.validation.routes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/copilot', copilotRoutes); 
app.use('/api', buyerRoutes);
// ✅ Routes API



// ✅ Test
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Connexion réussie entre React et Backend !' });
});

// Clé API utilisée
const apiKey = process.env.OPENAI_API_KEY;


// ✅ Serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});
