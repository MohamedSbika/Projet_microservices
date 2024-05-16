const Equipe = require('./equipe'); // Modèle Mongoose pour les équipes

// Créer une nouvelle équipe
const createEquipe = async (nom, description) => {
  try {
    const nouvelleEquipe = new Equipe({ nom, description });
    const equipeCree = await nouvelleEquipe.save();
    // Envoyer un message Kafka pour l'événement de création d'équipe
    await sendEquipeMessage('creation', equipeCree);
    return equipeCree;
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipe:', error);
    throw error;
  }
};

// Obtenir toutes les équipes
const getEquipes = async () => {
  return await Equipe.find(); // Utilisez `await` pour obtenir toutes les équipes
};

// Obtenir une équipe par ID
const getEquipeById = async (id) => {
  return await Equipe.findById(id); // Utilisez `await` pour trouver une équipe par son ID
};

const deleteEquipeById = async (id) => {
  try {
    const equipeSupprimee = await Equipe.findByIdAndDelete(id);
    // Envoyer un message Kafka pour l'événement de suppression d'équipe
    await sendEquipeMessage('suppression', equipeSupprimee);
    return equipeSupprimee;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'équipe:', error);
    throw error;
  }
};


const updateEquipeById = async (id, nom, description) => {
  try {
    const equipe = await Equipe.findByIdAndUpdate(id, { nom, description }, { new: true });
    if (!equipe) {
      throw new Error("Joueur non trouvé");
    }
    return equipe;
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour du equipe : ${error.message}`);
  }
};

// Exporter les services
module.exports = {
  createEquipe,
  getEquipes,
  getEquipeById,
  deleteEquipeById,
  updateEquipeById,
};
