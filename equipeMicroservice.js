const grpc = require('@grpc/grpc-js'); // Pour gRPC
const protoLoader = require('@grpc/proto-loader'); // Pour charger Protobuf
const mongoose = require('mongoose'); // Pour MongoDB
const Equipe = require('./equipe'); // Modèle Mongoose pour les équipes
const { updateEquipeById } = require('./EquipeService'); // Importer la fonction updateJoueurById depuis joueurService.js

// Chemin vers le fichier Protobuf
const equipeProtoPath = './equipe.proto'; 

// Charger le Protobuf
const equipeProtoDefinition = protoLoader.loadSync(equipeProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Charger le service Equipe du package gRPC
const equipeProto = grpc.loadPackageDefinition(equipeProtoDefinition).equipe;

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/microservices') // Utilisez IPv4 pour éviter les problèmes
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1); // Quitte le processus en cas d'erreur
  });

// Implémentation du service gRPC pour les équipes
const equipeService = {
  getEquipe: async (call, callback) => {
    try {
      const equipeId = call.request.equipe_id;
      const equipe = await Equipe.findById(equipeId);

      if (!equipe) {
        return callback(new Error("Équipe non trouvée"));
      }

      callback(null, { equipe }); 
    } catch (err) {
      callback(new Error("Erreur lors de la recherche de l'équipe")); 
    }
  },

  searchEquipes: async (call, callback) => {
    try {
      const equipes = await Equipe.find();
      callback(null, { equipes });
    } catch (err) {
      callback(new Error("Erreur lors de la recherche des équipes")); 
    }
  },

  createEquipe: async (call, callback) => {
    try {
      const { nom, description } = call.request;
      const nouvelleEquipe = new Equipe({ nom, description });
      const equipe = await nouvelleEquipe.save();

      callback(null, { equipe }); 
    } catch (err) {
      callback(new Error("Erreur lors de la création de l'équipe")); 
    }
  },

  deleteEquipeById: async (call, callback) => {
    try {
      const equipeId = call.request.equipe_id;
      const equipe = await Equipe.findByIdAndDelete(equipeId);
  
      if (!equipe) {
        return callback(new Error("Équipe non trouvée"));
      }
  
      callback(null, { message: "Équipe supprimée avec succès" });
    } catch (err) {
      callback(new Error("Erreur lors de la suppression de l'équipe"));
    }
  },

  updateEquipeById: async (call, callback) => {
    try {
      const { equipe_id, nom, description } = call.request;
      const equipe = await updateEquipeById(equipe_id, nom, description);
      callback(null, { equipe });
    } catch (error) {
      callback(new Error("Erreur lors de la mise à jour du l equipe"));
    }
  },
};


// Créer le serveur gRPC
const server = new grpc.Server(); 
server.addService(equipeProto.EquipeService.service, equipeService); 

const port = 50053; 
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error("Échec de la liaison du serveur:", err);
    return;
  }
  console.log(`Microservice Equipe opérationnel sur le port ${boundPort}`); 
});
