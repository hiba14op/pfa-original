import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'; // <-- à adapter selon ton chemin

const app = express();

// ✅ Middleware CORS configuré
import cors from 'cors';




// ✅ Middleware JSON
app.use(express.json());

// ✅ Routes API
app.use('/api/auth', authRoutes);

// ✅ Simple route de test
app.get('/getData', (req, res) => {
  res.send({ message: "Hello from backend!" });
});

// ✅ Démarrage du serveur
app.listen(5000, () => console.log('Backend is running on http://localhost:5000'));
