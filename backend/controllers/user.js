
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

exports.signup = (req, res, next) => {


  var Regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  if(Regex.test(req.body.password) == false) {
    //res.status(499).send({ message : "Le mot de passe entré n'est pas assez complexe." });
    throw new Error("Le mot de passe entré n'est pas assez complexe.");
  }
  else{

    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {

        const user = new User({
          userId: new mongoose.mongo.ObjectId(),
          email: req.body.email,
          password: hash,
        });

        user
          .save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((err) => {next(err);});
  }


};



exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              '2Kn%Bc`zj!CMyrP1g`eHdhJcmazyTU',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

