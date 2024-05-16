
# Project Title

Documentation Technique

Langages Utilisés

- JavaScript: Langage principal de programmation utilisé dans ce projet. Utilisé pour le développement de l'API Gateway, des services gRPC et des scripts côté client.
- Protobuf: Utilisé pour définir les messages échangés entre les services gRPC. Fournit une méthode de sérialisation efficace des données structurées.
- gRPC: Utilisé pour la communication entre les différents services, offrant une communication efficace et asynchrone entre les microservices.
- Apache Kafka: Utilisé pour la gestion des événements liés aux opérations CRUD sur les équipes, permettant une communication asynchrone entre les services.

Entités

- Equipe :
  - `id`: Identifiant unique de l'équipe (généré automatiquement).
  - `nom`: Nom de l'équipe.
  - `description`: Description de l'équipe.

- Joueur :
  - `id`: Identifiant unique du joueur (généré automatiquement).
  - `nom`: Nom du joueur.
  - `poste`: Poste ou position du joueur dans l'équipe.

Endpoints HTTP

Equipe

- GET /equipe
  - Description: Récupérer toutes les équipes.
  - Réponse attendue: Un tableau contenant toutes les équipes.
  - Code de réponse: 200 OK en cas de succès, 500 Erreur Serveur en cas d'erreur.

- GET /equipe/:id
  - Description: Récupérer une équipe par son ID.
  - Paramètres de la requête: id (identifiant de l'équipe).
  - Réponse attendue: Les détails de l'équipe correspondant à l'ID fourni.
  - Codes de réponse: 200 OK si l'équipe est trouvée, 404 Non trouvé si l'équipe n'existe pas, 500 Erreur Serveur en cas d'erreur.

- POST /equipe
  - Description: Créer une nouvelle équipe.
  - Corps de la requête: Objet JSON contenant les attributs nom et description de l'équipe.
  - Réponse attendue: Les détails de la nouvelle équipe créée.
  - Codes de réponse: 200 OK en cas de succès, 400 Bad Request si les données sont incorrectes, 500 Erreur Serveur en cas d'erreur.

- PUT /equipe/:id
  - Description: Mettre à jour les informations d'une équipe existante.
  - Paramètres de la requête: id (identifiant de l'équipe à mettre à jour).
  - Corps de la requête: Objet JSON contenant les attributs à mettre à jour (nom et/ou description).
  - Réponse attendue: Les détails de l'équipe mise à jour.
  - Codes de réponse: 200 OK si l'équipe est mise à jour avec succès, 404 Non trouvé si l'équipe n'existe pas, 500 Erreur Serveur en cas d'erreur.

- DELETE /equipe/:id
  - Description: Supprimer une équipe existante par son ID.
  - Paramètres de la requête: id (identifiant de l'équipe à supprimer).
  - Réponse attendue: Message de confirmation de suppression.
  - Codes de réponse: 200 OK si l'équipe est supprimée avec succès, 404 Non trouvé si l'équipe n'existe pas, 500 Erreur Serveur en cas d'erreur.

Joueur

- GET /joueur
  - Description: Récupérer tous les joueurs.
  - Réponse attendue: Un tableau contenant tous les joueurs.
  - Code de réponse: 200 OK en cas de succès, 500 Erreur Serveur en cas d'erreur.

- GET /joueur/:id
  - Description: Récupérer un joueur par son ID.
  - Paramètres de la requête: id (identifiant du joueur).
  - Réponse attendue: Les détails du joueur correspondant à l'ID fourni.
  - Codes de réponse: 200 OK si le joueur est trouvé, 404 Non trouvé si le joueur n'existe pas, 500 Erreur Serveur en cas d'erreur.

- POST /joueur
  - Description: Créer un nouveau joueur.
  - Corps de la requête: Objet JSON contenant les attributs nom et poste du joueur.
  - Réponse attendue: Les détails du nouveau joueur créé.
  - Codes de réponse: 200 OK en cas de succès, 400 Bad Request si les données sont incorrectes, 500 Erreur Serveur en cas d'erreur.

- PUT /joueur/:id
  - Description: Mettre à jour les informations d'un joueur existant.
  - Paramètres de la requête: id (identifiant du joueur à mettre à jour).
  - Corps de la requête: Objet JSON contenant les attributs à mettre à jour (nom et/ou poste).
  - Réponse attendue: Les détails du joueur mis à jour.
  - Codes de réponse: 200 OK si le joueur est mis à jour avec succès, 404 Non trouvé si le joueur n'existe pas, 500 Erreur Serveur en cas d'erreur.

- DELETE /joueur/:id
  - Description: Supprimer un joueur existant par son ID.
  - Paramètres de la requête: id (identifiant du joueur à supprimer).
  - Réponse attendue: Message de confirmation de suppression.
  - Codes de réponse: 200 OK si le joueur est supprimé avec succès, 404 Non trouvé si le joueur n'existe pas, 500 Erreur Serveur en cas d'erreur.



Conclusion

La combinaison de JavaScript, gRPC et Apache Kafka offre une architecture robuste et évolutive pour le développement de microservices dans ce projet. Ces technologies permettent une communication efficace, une gestion des flux de données en temps réel et une extensibilité pour répondre aux besoins de l'application.

