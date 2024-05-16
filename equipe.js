const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipeSchema = new Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Equipe = mongoose.model('Equipe', equipeSchema);

module.exports = Equipe;
