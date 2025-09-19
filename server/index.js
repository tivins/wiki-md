const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const database = require('./database');
require('dotenv').config();

const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Connexion à SQLite
database.connect()
  .then(() => console.log('Base de données SQLite initialisée'))
  .catch(err => console.error('Erreur de connexion SQLite:', err));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne correctement' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion propre de la fermeture
process.on('SIGINT', () => {
  console.log('\nFermeture du serveur...');
  database.close();
  process.exit(0);
});
