const mysql = require('mysql2');
require('dotenv').config();

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'bd1'
  });

  db.connect((err) => {
    if (err) {
      console.error('❌ Erreur de connexion, nouvelle tentative dans 2s...', err);
      setTimeout(handleDisconnect, 2000); // Retry after 2s
    } else {
      console.log('✅ Connexion à la base de données réussie');
    }
  });

  db.on('error', (err) => {
    console.error('❗ Erreur MySQL : ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if connection is lost
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = () => db;
