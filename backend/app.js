const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://OCAdmin:SoPekocko!42@cluster0.qm0fk.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const sauceRoutes = require('./routes/sauce');
  const utilisateurRoutes = require("./routes/utilisateur");

  app.use("/api/sauce", sauceRoutes);
  app.use("/api/auth", utilisateurRoutes);



module.exports = app;