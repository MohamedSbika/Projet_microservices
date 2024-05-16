const Joueur = require('./joueur'); // Modèle du joueur
const { sendJoueurMessage } = require('./JoueurProducer'); // Importer la fonction sendJoueurMessage

const createJoueur = async (nom, poste) => {
  try {
    const nouveauJoueur = new Joueur({ nom, poste }); // Utilisation du modèle Joueur
    const joueurCree = await nouveauJoueur.save();
    // Envoyer un message Kafka pour l'événement de création de joueur
    await sendJoueurMessage('creation', joueurCree);
    return joueurCree;
  } catch (error) {
    console.error('Erreur lors de la création de joueur:', error);
    throw error;
  }
};

const getJoueurs = async () => {
  return await Joueur.find(); // Obtenir tous les joueurs
};

const getJoueurById = async (id) => {
  return await Joueur.findById(id); // Trouver un joueur par son ID
};

const deleteJoueurById = async (id) => {
  try {
    const joueurSupprimee = await Joueur.findByIdAndDelete(id);
    // Envoyer un message Kafka pour l'événement de suppression de joueur
    await sendJoueurMessage('suppression', joueurSupprimee);
    return joueurSupprimee;
  } catch (error) {
    console.error('Erreur lors de la suppression de joueur:', error);
    throw error;
  }
};

const updateJoueurById = async (id, nom, poste) => {
  try {
    const joueur = await Joueur.findByIdAndUpdate(id, { nom, poste }, { new: true });
    if (!joueur) {
      throw new Error("Joueur non trouvé");
    }
    return joueur;
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour du joueur : ${error.message}`);
  }
};


module.exports = {
  createJoueur,
  getJoueurs,
  getJoueurById,
  deleteJoueurById,
  updateJoueurById,
};
