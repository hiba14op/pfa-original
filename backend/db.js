const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'bd1'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connexion à la base de données réussie');
});

module.exports = db;
