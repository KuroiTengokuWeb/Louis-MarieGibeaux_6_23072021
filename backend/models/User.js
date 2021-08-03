// Importations
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création d'un schema User
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Applique l'email unique en BDD
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);