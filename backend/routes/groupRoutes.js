const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/join', async (req, res) => {
    const { groupId, userId } = req.body;
    try {
        await db.query(
            'INSERT INTO Groupparticipation (groupId, userId) VALUES (?, ?)',
            [groupId, userId]
        );
        res.json({ message: 'Groupe rejoint avec succès !' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
