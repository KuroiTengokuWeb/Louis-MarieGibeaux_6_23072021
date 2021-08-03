// Importation
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cryptoJS = require('crypto-js');

// Création de compte
exports.signup = (req, res, next) => {
    // Crypt l'email
    const key = cryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
    const iv = cryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
    const encrypted = cryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();

    // Hashage du mot de passe avec Bcrypt + nombre de tour de hashage
    bcrypt.hash(req.body.password, 10)

    .then(hash => {
        const user = new User({
            email: encrypted,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Authentification
exports.login = (req, res, next) => {
    // Crypt l'email
    const key = cryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
    const iv = cryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
    const encrypted = cryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
    
    // Cherche le mail dans la BDD
    User.findOne({ email: encrypted })
    .then( user => {
        // Vérifie si user existe
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé'});
        }
        // Si oui, comparer les mots de passe 
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // Si la comparaison est fausse
            if (!valid) {
                return res.status(401).json({ error: 'Mot de pass incorrect !'});
            }
            // Si la comparaison est vraie
            res.status(200).json({
                userId: user._id,
                // Création du token jwt
                token: jwt.sign(
                    { userId: user._id },
                    'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
};