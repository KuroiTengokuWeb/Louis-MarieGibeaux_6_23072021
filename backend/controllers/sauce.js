const Sauce = require('../models/Sauce');
const fs = require('fs');


/* probleme string vide */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

/* Recupere une sauce */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/* Recupere toutes les sauces */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const currentFilename = sauce.imageUrl.split('/images/')[1];
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => {
                    if (req.file) {
                        fs.unlink(`images/${currentFilename}`, () => {
                            res.status(200).json({ message: 'Objet modifié !'})
                        });
                    } else {
                        res.status(200).json({ message: 'Objet modifié !'})
                    }

                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet supprimé" }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Flags 
            // includes permet de déterminer si un array contient une valeur ( l'userId dans notre cas ) et return un bool
            const isUserLike = sauce.usersLiked.includes(req.body.userId),
                  isUserDislike = sauce.usersDisliked.includes(req.body.userId);

            // On stock dans des variables car innexistante dans la req
            // les tableau d'utilisateur de like et dislike filtrer dans l'id utilisateur
            // le nombre de like et dislike que l'on va incrémenter ou décrémenter
            let filteredArrayUsersLiked = sauce.usersLiked.filter(uid => uid != req.body.userId),
                filteredArrayUsersDisliked = sauce.usersDisliked.filter(uid => uid != req.body.userId),
                nbLikes = sauce.likes,
                nbDislikes = sauce.dislikes,
                message = "Successfully ";
            
            if (req.body.like == 1) { // Like
                // Push l'utilisateur qui like dans le tableau des usersliked
                filteredArrayUsersLiked.push(req.body.userId);
                // incrément le nb like
                nbLikes++;
                // Si l'utilisateur existait dans le tableau des usersDisliked alors on décrémente les dislikes
                if(isUserDislike) nbDislikes--;

                message += "Liked !";
            } else if (req.body.like == -1) { // Dislike
                 // Push l'utilisateur qui like dans le tableau des usersDisliked
                filteredArrayUsersDisliked.push(req.body.userId);
                // incrément le nb dislike
                nbDislikes++;
                 // Si l'utilisateur existait dans le tableau des usersLiked alors on décrémente les likes
                if(isUserLike) nbLikes--;

                message += "Disliked !";
            } else { // Cancel like or dislike
                if(isUserLike) nbLikes--;  // Si l'utilisateur existait dans le tableau des usersLiked alors on décrémente les likes
                else if (isUserDislike) nbDislikes--;  // Si l'utilisateur existait dans le tableau des usersDisliked alors on décrémente les dislikes

                message += isUserLike ? "Unliked !" : "Undisliked !";
            }

            // Déclaration de l'objet envoyé en base
            const sauceObject = {
                likes: nbLikes,
                dislikes: nbDislikes,
                usersLiked: filteredArrayUsersLiked,
                usersDisliked: filteredArrayUsersDisliked
            };
            // Update
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(()=> {
                res.status(200).json({ message });
            });
        })
        .catch(error => res.status(400).json({ error }));
};