const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

var bodyParser = require('body-parser');

var dotenv = require("dotenv");
dotenv.config();
var urlmongo = process.env.MONGOLAB_URI;

console.log(urlmongo);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




mongoose
  .connect(urlmongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  const sauceRoutes = require('./routes/sauce');
  const userRoutes = require("./routes/user");

  app.use("/api/sauces", sauceRoutes);
  app.use("/api/auth", userRoutes);



module.exports = app;