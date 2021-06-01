const express = require('express');
const mongoose = require('mongoose');

const app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




mongoose.connect('mongodb+srv://OCAdmin:SoPekocko!42@cluster0.qm0fk.mongodb.net/Sopekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const sauceRoutes = require('./routes/sauce');
  const userRoutes = require("./routes/user");

  app.use("/api/sauce", sauceRoutes);
  app.use("/api/auth", userRoutes);



module.exports = app;