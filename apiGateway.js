const express = require('express'); // Framework Express
const bodyParser = require('body-parser'); // Pour traiter le JSON
const cors = require('cors'); // Pour autoriser les requêtes cross-origin

const connectDB = require('./database'); // Connexion à MongoDB
const Equipe = require('./equipe'); // Modèle Fournisseur
const Joueur = require('./joueur'); // Modèle Produit
const { sendEquipeMessage } = require('./EquipeProducer'); // Importer la fonction sendEquipeMessage
const { sendJoueurMessage } = require('./JoueurProducer'); // Importer la fonction sendEquipeMessage


const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

const joueurProtoPath = './joueur.proto';
const joueurProtoDefinition = protoLoader.loadSync(joueurProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const joueurProto = grpc.loadPackageDefinition(joueurProtoDefinition).joueur;



const equipeProtoPath = './equipe.proto';
const equipeProtoDefinition = protoLoader.loadSync(equipeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const equipeProto = grpc.loadPackageDefinition(equipeProtoDefinition).equipe;




const app = express(); // Créer l'application Express


// Connexion à MongoDB
connectDB();

app.use(cors()); // Autoriser les requêtes cross-origin
app.use(bodyParser.json()); // Traiter le JSON


const joueurClient = new joueurProto.JoueurService('localhost:50054', grpc.credentials.createInsecure());


const equipeClient = new equipeProto.EquipeService('localhost:50053', grpc.credentials.createInsecure());






// Endpoints pour les fournisseurs
app.get('/equipe', async (req, res) => {
  try {
    const equipes = await Equipe.find(); // Obtenir tous les fournisseurs
    res.json(equipes);
  } catch (err) {
    res.status(500).send("Erreur lors de la recherche des equipes: " + err.message);
  }
});

app.get('/equipe/:id', async (req, res) => {
  try {
    const equipe = await Equipe.findById(req.params.id); // Obtenir le fournisseur par ID
    if (!equipe) {
      return res.status(404).send("Equipe non trouvé");
    }
    res.json(equipe);
  } catch (err) {
    res.status(500).send("Erreur lors de la recherche du equipe: " + err.message);
  }
});

app.post('/equipe', async (req, res) => {
  try {
    const { nom, description } = req.body; // Obtenir les données du corps de la requête
    const nouveauEquipe = new Equipe({ nom, description });
    const equipe = await nouveauEquipe.save(); // Sauvegarder le fournisseur
    await sendEquipeMessage('creation', equipe);

    // Appel gRPC pour créer une équipe
    equipeClient.createEquipe({ nom: equipe.nom, description: equipe.description }, (error, response) => {
      if (error) {
        console.error("Erreur lors de la création de l'équipe via gRPC:", error);
        res.status(500).send("Erreur lors de la création du equipe via gRPC");
      } else {
        console.log("Équipe créée avec succès via gRPC:", response.equipe);
        res.json(response.equipe); // Retourner le fournisseur créé
      }
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la création du equipe: " + err.message);
  }
});

// Endpoint pour supprimer un joueur par ID
app.delete('/equipe/:id', async (req, res) => {
  try {
    const equipe = await Equipe.findByIdAndDelete(req.params.id); // Supprimer le joueur par ID

    if (!equipe) {
      return res.status(404).send("equipe non trouvé");
    }

    await sendEquipeMessage('suppression', equipe);

    // Appel gRPC pour supprimer une équipe
    equipeClient.deleteEquipeById({ equipe_id: req.params.id }, (error, response) => {
      if (error) {
        console.error("Erreur lors de la suppression de l'équipe via gRPC:", error);
        res.status(500).send("Erreur lors de la suppression du equipe via gRPC");
      } else {
        console.log("Équipe supprimée avec succès via gRPC:", response.message);
        res.json(response); // Retourner un message de succès
      }
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la suppression du equipe: " + err.message);
  }
});

// Endpoint pour mettre à jour un joueur par ID
app.put('/equipe/:id', async (req, res) => {
  try {
    const { nom, description } = req.body;
    const equipeId = req.params.id;
    
    // Mettre à jour l'équipe dans la base de données MongoDB
    const equipe = await Equipe.findByIdAndUpdate(equipeId, { nom, description }, { new: true });
    
    if (!equipe) {
      return res.status(404).send("Équipe non trouvée");
    }

    // Appel gRPC pour mettre à jour l'équipe
    equipeClient.updateEquipeById({ equipe_id: equipeId, nom: equipe.nom, description: equipe.description }, (error, response) => {
      if (error) {
        console.error("Erreur lors de la mise à jour de l'équipe via gRPC:", error);
        res.status(500).send("Erreur lors de la mise à jour du equipe via gRPC");
      } else {
        console.log("Équipe mise à jour avec succès via gRPC:", response.equipe);
        res.json(response.equipe); // Retourner l'équipe mise à jour
      }
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour du equipe: " + err.message);
  }
});

// Endpoints pour les produits
app.post('/joueur', async (req, res) => {
  try {
    const { nom, poste } = req.body;
    const nouveauJoueur = new Joueur({ nom, poste });
    const joueur = await nouveauJoueur.save(); // Sauvegarder le produit
    await sendJoueurMessage('creation', joueur);

    // Appel gRPC pour créer un joueur
    joueurClient.createJoueur({ nom: joueur.nom, poste: joueur.poste }, (error, response) => {
      if (error) {
        console.error("Erreur lors de la création du joueur via gRPC:", error);
        res.status(500).send("Erreur lors de la création du joueur via gRPC");
      } else {
        console.log("Joueur créé avec succès via gRPC:", response.joueur);
        res.json(response.joueur); // Retourner le joueur créé
      }
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la création du joueur: " + err.message);
  }
});

// Endpoint pour supprimer un joueur par ID
app.delete('/joueur/:id', async (req, res) => {
  try {
    const joueur = await Joueur.findByIdAndDelete(req.params.id); // Supprimer le joueur par ID

    if (!joueur) {
      return res.status(404).send("Joueur non trouvé");
    }
    await sendJoueurMessage('suppression', joueur);

    // Appel gRPC pour supprimer un joueur
    joueurClient.deleteJoueurById({ joueur_id: req.params.id }, (error, response) => {
      if (error) {
        console.error("Erreur lors de la suppression du joueur via gRPC:", error);
        res.status(500).send("Erreur lors de la suppression du joueur via gRPC");
      } else {
        console.log("Joueur supprimé avec succès via gRPC:", response.message);
        res.json(response); // Retourner un message de succès
      }
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la suppression du joueur: " + err.message);
  }
});

// Endpoint pour mettre à jour un joueur par ID
app.put('/joueur/:id', async (req, res) => {
  try {
    const { nom, poste } = req.body;
    const joueurId = req.params.id;
    
    // Mettre à jour le joueur dans la base de données MongoDB
    const joueur = await Joueur.findByIdAndUpdate(joueurId, { nom, poste }, { new: true });
    
    if (!joueur) {
      return res.status(404).send("Joueur non trouvé");
    }

    // Appel gRPC pour mettre à jour le joueur
    joueurClient.updateJoueurById({ joueur_id: joueurId, nom: joueur.nom, poste: joueur.poste }, (error, response) => {
      if (error) {
        console.error("Erreur lors de la mise à jour du joueur via gRPC:", error);
        res.status(500).send("Erreur lors de la mise à jour du joueur via gRPC");
      } else {
        console.log("Joueur mis à jour avec succès via gRPC:", response.joueur);
        res.json(response.joueur); // Retourner le joueur mis à jour
      }
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour du joueur: " + err.message);
  }
});

// D'autres endpoints...

// Démarrer le serveur Express
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway opérationnel sur le port ${port}`);
});
