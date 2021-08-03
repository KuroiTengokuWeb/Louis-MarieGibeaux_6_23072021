// Importations
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion de l'API à MongoDB
mongoose.connect('mongodb+srv://Kuroi_Tengoku:LOV8vJ4GcQa8CZmb@cluster0.nr45s.mongodb.net/project6?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création de l'app
const app = express();

// Helmet
app.use(helmet());

// middleware définition des headers pour les requêtes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// middleware qui transforme le corps des requetes en JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware acces statiques aux images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utilisation des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Exportation de l'app pour l'utilisation dans d'autres fichiers
module.exports = app;