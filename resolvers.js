const grpc = require('@grpc/grpc-js'); // Pour gRPC
const protoLoader = require('@grpc/proto-loader'); // Pour charger Protobuf
const Joueur = require('./joueur'); // Importez votre modèle Joueur
const Equipe = require('./equipe');
const { sendEquipeMessage } = require('./EquipeProducer'); // Importez la fonction d'envoi de message Kafka depuis EquipeProducer.js
const { sendJoueurMessage } = require('./JoueurProducer'); // Importez la fonction d'envoi de message Kafka depuis EquipeProducer.js



// Charger les fichiers Protobuf
const equipeProtoPath = './equipe.proto';
const joueurProtoPath = './joueur.proto';

const equipeProtoDefinition = protoLoader.loadSync(equipeProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const joueurProtoDefinition = protoLoader.loadSync(joueurProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const equipeProto = grpc.loadPackageDefinition(equipeProtoDefinition).equipe;
const joueurProto = grpc.loadPackageDefinition(joueurProtoDefinition).joueur;

// Créer les clients gRPC
const agentEquipe = new equipeProto.EquipeService('localhost:50053', grpc.credentials.createInsecure());
const agentJoueur = new joueurProto.JoueurService('localhost:50054', grpc.credentials.createInsecure());

// Résolveurs pour GraphQL
const resolvers = {
  Query: {
    equipe : async (_, { id }) => {
      return new Promise((resolve, reject) => {
        agentEquipe.getEquipe({ equipe_id: id }, (err, response) => {
          if (err) {
            reject(new Error("Erreur lors de l'appel du service equipe: " + err.message));
          } else {
            resolve(response.equipe); // Fournisseur trouvé
          }
        });
      });
    },
    
    equipes: async () => {
      return new Promise((resolve, reject) => {
        agentEquipe.searchEquipes({}, (err, response) => {
          if (err) {
            reject(new Error("Erreur lors de l'appel du service equipes: " + err.message));
          } else {
            resolve(response.equipes); // Liste des equipes
          }
        });
      });
    },
    
    joueur : async (_, { id }) => {
      return new Promise((resolve, reject) => {
        agentJoueur.getJoueur({ joueur_id: id }, (err, response) => {
          if (err) {
            reject(new Error("Erreur lors de l'appel du service joueur: " + err.message));
          } else {
            resolve(response.joueur); // Produit trouvé
          }
        });
      });
    },
    
    joueurs: async () => {
      return new Promise((resolve, reject) => {
        agentJoueur.searchJoueurs({}, (err, response) => {
          if (err) {
            reject(new Error("Erreur lors de l'appel du service joueur: " + err.message));
          } else {
            resolve(response.joueurs); // Liste des produits
          }
        });
      });
    },
  },

  Mutation: {
    createEquipe: async (_, { nom, description }) => {
      return new Promise((resolve, reject) => {
        agentEquipe.createEquipe({ nom, description }, async (err, response) => {
          if (err) {
            reject(new Error("Erreur lors de la création du equipe: " + err.message));
          } else {
            // Envoyer un message Kafka pour l'événement de création d'équipe
            await sendEquipeMessage('creation', response.equipe);
            resolve(response.equipe);
          }
        });
      });
    },
    deleteEquipeById: async (_, { id }) => {
      try {
        // Supprimer le joueur de la base de données
        const deletedEquipe = await Equipe.findByIdAndDelete(id);
        
        // Vérifier si le joueur a été trouvé et supprimé avec succès
        if (!deletedEquipe) {
          throw new Error("Joueur non trouvé");
        }

        // Envoyer un message Kafka pour l'événement de suppression d'équipe
        await sendEquipeMessage('suppression', deletedEquipe);
        
        // Retourner les données du joueur supprimé
        return deletedEquipe;
      } catch (error) {
        // Gérer les erreurs de suppression du joueur
        throw new Error(`Erreur lors de la suppression du equipe : ${error.message}`);
      }
    },

    updateEquipeById: async (_, { id, input }) => {
      try {
        // Recherche du joueur à mettre à jour dans la base de données
        const equipeToUpdate = await Equipe.findById(id);
        
        // Vérifier si le joueur existe dans la base de données
        if (!equipeToUpdate) {
          throw new Error("equipe non trouvé");
        }
        
        // Mettre à jour les propriétés du joueur avec les nouvelles valeurs
        equipeToUpdate.nom = input.nom || equipeToUpdate.nom;
        equipeToUpdate.description = input.description || equipeToUpdate.description;
        
        // Enregistrer les modifications dans la base de données
        const updatedEquipe = await equipeToUpdate.save();
        
        // Envoyer un message Kafka pour l'événement de modification d'équipe
        await sendEquipeMessage('modification', updatedEquipe);
        
        // Retourner les données du joueur mis à jour
        return updatedEquipe;
      } catch (error) {
        // Gérer les erreurs de mise à jour du joueur
        throw new Error(`Erreur lors de la mise à jour du equipe : ${error.message}`);
      }
    },

    createJoueur: async (_, { nom, poste }) => {
      return new Promise((resolve, reject) => {
        agentJoueur.createJoueur({ nom, poste }, async (err, response) => {
          if (err) {
            reject(new Error("Erreur lors de la création du joueur: " + err.message));
          } else {
            // Envoyer un message Kafka pour l'événement de création de joueur
            await sendJoueurMessage('creation', response.joueur);
            resolve(response.joueur); // Joueur créé
          }
        });
      });
    },
    
    deleteJoueurById: async (_, { id }) => {
      try {
        // Supprimer le joueur de la base de données
        const deletedJoueur = await Joueur.findByIdAndDelete(id);
        
        // Vérifier si le joueur a été trouvé et supprimé avec succès
        if (!deletedJoueur) {
          throw new Error("Joueur non trouvé");
        }
        
        // Envoyer un message Kafka pour l'événement de suppression de joueur
        await sendJoueurMessage('suppression', deletedJoueur);
        
        // Retourner les données du joueur supprimé
        return deletedJoueur;
      } catch (error) {
        // Gérer les erreurs de suppression du joueur
        throw new Error(`Erreur lors de la suppression du joueur : ${error.message}`);
      }
    },
    

    updateJoueurById: async (_, { id, input }) => {
      try {
        // Recherche du joueur à mettre à jour dans la base de données
        const joueurToUpdate = await Joueur.findById(id);
        
        // Vérifier si le joueur existe dans la base de données
        if (!joueurToUpdate) {
          throw new Error("Joueur non trouvé");
        }
        
        // Mettre à jour les propriétés du joueur avec les nouvelles valeurs
        joueurToUpdate.nom = input.nom || joueurToUpdate.nom;
        joueurToUpdate.poste = input.poste || joueurToUpdate.poste;
        
        // Enregistrer les modifications dans la base de données
        const updatedJoueur = await joueurToUpdate.save();
        
        // Envoyer un message Kafka pour l'événement de modification de joueur
        await sendJoueurMessage('modification', updatedJoueur);
        
        // Retourner les données du joueur mis à jour
        return updatedJoueur;
      } catch (error) {
        // Gérer les erreurs de mise à jour du joueur
        throw new Error(`Erreur lors de la mise à jour du joueur : ${error.message}`);
      }
    },
    
  },
};

module.exports = resolvers; // Exporter les résolveurs
