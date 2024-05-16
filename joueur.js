const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const joueurSchema = new Schema({
  nom: {
    type: String,
    required: true, // Champs obligatoires
  },
  poste: {
    type: String,
    required: true,
  },
});

const Joueur = mongoose.model('Joueur', joueurSchema);

module.exports = Joueur;
