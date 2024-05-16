const grpc = require('@grpc/grpc-js'); // Pour gRPC
const protoLoader = require('@grpc/proto-loader'); // Pour charger Protobuf
const mongoose = require('mongoose'); // Pour MongoDB
const Joueur = require('./joueur'); // Modèle Mongoose pour les joueurs
const { updateJoueurById } = require('./JoueurService'); // Importer la fonction updateJoueurById depuis joueurService.js

// Chemin vers le fichier Protobuf
const joueurProtoPath = './joueur.proto'; 

// Charger le Protobuf
const joueurProtoDefinition = protoLoader.loadSync(joueurProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Charger le service Joueur du package gRPC
const joueurProto = grpc.loadPackageDefinition(joueurProtoDefinition).joueur;

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/microservices') // Utilisez IPv4 pour éviter les problèmes
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1); // Quitte le processus en cas d'erreur
  });

// Implémentation du service gRPC pour les joueurs
const joueurService = {
  getJoueur: async (call, callback) => {
    try {
      const joueurId = call.request.joueur_id;
      const joueur = await Joueur.findById(joueurId);

      if (!joueur) {
        return callback(new Error("Joueur non trouvé"));
      }

      callback(null, { joueur }); 
    } catch (err) {
      callback(new Error("Erreur lors de la recherche du joueur")); 
    }
  },

  searchJoueurs: async (call, callback) => {
    try {
      const joueurs = await Joueur.find();
      callback(null, { joueurs });
    } catch (err) {
      callback(new Error("Erreur lors de la recherche des joueurs")); 
    }
  },

  createJoueur: async (call, callback) => {
    try {
      const { nom, poste } = call.request;
      const nouveauJoueur = new Joueur({ nom, poste });
      const joueur = await nouveauJoueur.save();

      callback(null, { joueur }); 
    } catch (err) {
      callback(new Error("Erreur lors de la création du joueur")); 
    }
  },
  
  deleteJoueurById: async (call, callback) => {
    try {
      const joueurId = call.request.joueur_id;
      const joueur = await Joueur.findByIdAndDelete(joueurId);

      if (!joueur) {
        return callback(new Error("Joueur non trouvé"));
      }

      callback(null, { message: "Joueur supprimé avec succès" }); 
    } catch (err) {
      callback(new Error("Erreur lors de la suppression du joueur")); 
    }
  },

  
  updateJoueurById: async (call, callback) => {
    try {
      const { joueur_id, nom, poste } = call.request; // Récupérer l'ID du joueur et les données de mise à jour
      const joueur = await updateJoueurById(joueur_id, nom, poste); // Appeler la fonction de mise à jour du joueur
      callback(null, { joueur }); // Retourner le joueur mis à jour
    } catch (error) {
      callback(new Error("Erreur lors de la mise à jour du joueur : " + error.message));
    }
  },
};

// Créer le serveur gRPC
const server = new grpc.Server(); 
server.addService(joueurProto.JoueurService.service, joueurService); 

const port = 50054; 
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error("Échec de la liaison du serveur:", err);
    return;
  }
  console.log(`Microservice Joueur opérationnel sur le port ${boundPort}`); 
});
