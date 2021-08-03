// Importations
const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// Routes

// Affiche toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

// Affiche une sauce celon l'id
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Création d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// Modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Supression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Gestion des likes pour une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;