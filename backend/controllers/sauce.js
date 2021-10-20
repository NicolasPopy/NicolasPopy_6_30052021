const Sauce = require("../models/sauce");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const fs = require('fs');

//regex :
var regex = /^[A-Za-z\d@$!%*#?&]{2,}$/;


// #################################################################
// Récupére toutes les sauces
// #################################################################

exports.getAllSauce = (req, res, next) => {        
    
        Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// #################################################################
// Crée une sauce
// #################################################################

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    
    if (!sauceObject.userId || !sauceObject.name ||
        !sauceObject.manufacturer || !sauceObject.description ||
        !sauceObject.mainPepper || !sauceObject.heat ||
        !req.file.path) {
        return res.status(422).json({ error: 'Un ou plusieurs champs n\'ont pas été remplis.' });
    }


    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });

    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => console.log(error) );
};

// #################################################################
// Récupére 1 sauce
// #################################################################

exports.getOneSauce = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

// #################################################################
// Modifie 1 sauce
// #################################################################

exports.modifySauce = (req,res,next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
}

// #################################################################
// Efface une sauce
// #################################################################

exports.deleteSauce = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
}


// #################################################################
// Like/Dislike une sauce
// #################################################################

exports.likeSauce = async (req,res,next) => {
    var idsauce = req.params.id;
    var userId = req.body.userId;
    var like = req.body.like;

    var sauce = await Sauce.findOne({_id: idsauce}).exec();;

    if(sauce.usersDisliked == undefined)
        sauce.usersDisliked = new Array();

    if(sauce.usersLiked == undefined)
        sauce.usersLiked = new Array();


    var uDislike = sauce.usersDisliked != undefined && sauce.usersDisliked.includes(userId);
    var uLike =sauce.usersLiked != undefined &&  sauce.usersLiked.includes(userId);


    switch (like) {
        case -1:
            // compteur j'aime pas et user dans tableau dislikeuser
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);
            
            break
        case 0:
            // compteur -1 et enlève user du tableau où il est
            if(uDislike == true)
            { 
                sauce.dislikes -= 1;
                sauce.usersDisliked.remove(userId);
            }
            else
            {
                if(uLike == true)
                { 
                    sauce.likes -= 1;
                    sauce.usersLiked.remove(userId);
                }
            }
            break;
        case 1:
            // compteur jaime et user dans tableau likeuser
            sauce.likes += 1;
            sauce.usersLiked.push(userId);
            break;
    };

    Sauce.updateOne({ _id: idsauce }, { dislikes : sauce.dislikes,usersDisliked:sauce.usersDisliked,likes:sauce.likes,usersLiked:sauce.usersLiked, _id: idsauce })
    .then(() => res.status(200).json({ message: 'Compteur de sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
}