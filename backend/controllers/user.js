
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const CryptoJS = require("crypto-js");

exports.signup = (req, res, next) => {

  var Regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if(Regex.test(req.body.password) == false) {
    res.writeHead(400,
      'Mot de passe requis : 8 caractères minimum. Au moins 1 majuscule, 1 minuscule, 1 chiffre et un caractère spécial.');  
      res.end();
  }
  else{

    var emailcrypt = CryptoJS.SHA256(
      req.body.email,
      "68.4t2r*Y595W8$T"
    ).toString();

    //  ## Recherche si email existe déjà en BDD
    User.findOne({ email: emailcrypt })
      .then((user) => {
        if (user) {
          res.writeHead(
            500,
            "Cet utilisateur existe déjà dans notre base de données"
          );
          res.end();
        }
      })
      .catch((err) => {
        next(err);
      });


      // Sauvegarde
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: emailcrypt,
          password: hash,
        });

        user
          .save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch((error) =>  {
            res.writeHead(400,error);  
            res.end();
          });
      })
      .catch((err) => {next(err);});
  }
};

// ###################################
// Login
// ##############################

exports.login = (req, res, next) => {


      var emailcrypt = CryptoJS.SHA256(
        req.body.email,
        "68.4t2r*Y595W8$T"
      ).toString();

  User.findOne({ email: emailcrypt })
    .then((user) => {
      if (!user) {
        res.writeHead(
          401,
          "Cet utilisateur n'existe pas dans notre base de données"
        );
        res.end();
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            res.writeHead(401, "Le mot de passe est incorrrect.");
            res.end();
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              "2Kn%Bc`zj!CMyrP1g`eHdhJcmazyTU",
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => {
          res.writeHead(500, error);
          res.end();
        });
    })
    .catch((error) => {
      res.writeHead(500, error);
      res.end();
    });
};




