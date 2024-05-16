
# Projet microservices

Documentation Technique


But de projet 🎯 



![Logo](https://blog.hubspot.com/hs-fs/hubfs/apiendpoint_0.webp?width=650&height=247&name=apiendpoint_0.webp)

Le but du projet est de développer une architecture de microservices pour gérer des équipes et des joueurs dans le contexte d'une application sportive. Cette architecture utilise divers langages et technologies, notamment JavaScript, Protobuf, gRPC, Apache Kafka et MongoDB. Les microservices communiquent entre eux de manière asynchrone pour offrir des performances et une évolutivité optimales. L'API Gateway, les services gRPC et les scripts côté client sont développés en JavaScript. Protobuf est utilisé pour définir les messages échangés entre les services gRPC, tandis que Kafka est utilisé pour la gestion des événements liés aux opérations CRUD sur les équipes. MongoDB est choisi comme base de données pour stocker les informations sur les équipes et les joueurs. Enfin, Thunder ou Postman sont utilisés pour tester les endpoints de l'application.

Langages Utilisés

- JavaScript: Langage principal de programmation utilisé dans ce projet. Utilisé pour le développement de l'API Gateway, des services gRPC et des scripts côté client.
![Logo](https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png)
- Protobuf: Utilisé pour définir les messages échangés entre les services gRPC. Fournit une méthode de sérialisation efficace des données structurées.
![Logo](https://cdn-contents.anymindgroup.com/corporate/wp-uploads/2021/10/06092952/logo.png)
- gRPC: Utilisé pour la communication entre les différents services, offrant une communication efficace et asynchrone entre les microservices.
![Logo](https://blog.postman.com/wp-content/uploads/2023/11/What-is-gRPC_.jpg)
- Apache Kafka: Utilisé pour la gestion des événements liés aux opérations CRUD sur les équipes, permettant une communication asynchrone entre les services.
![Logo](https://www.ovhcloud.com/sites/default/files/styles/text_media_horizontal/public/2021-09/ECX-1909_Hero_Kafka_600x400%402x-1.png)

Entités

- Equipe :
  - `id`: Identifiant unique de l'équipe (généré automatiquement).
  - `nom`: Nom de l'équipe.
  - `description`: Description de l'équipe.

- Joueur :
  - `id`: Identifiant unique du joueur (généré automatiquement).
  - `nom`: Nom du joueur.
  - `poste`: Poste ou position du joueur dans l'équipe.


Exigences  techniques
- VScode (editeur de texte) 📄
![Logo](https://yt3.googleusercontent.com/_q52i8bUAEvcb7JR4e-eNTv23y2A_wg5sCz0NC0GrGtcw1CRMWJSOPVHUDh_bngD0q4gMvVeoA=s900-c-k-c0x00ffffff-no-rj)
- Kafka ou Kadeck (communication entre les microservices) 📞 

![Logo](https://i.ytimg.com/vi/O7znCGe0u2s/maxresdefault.jpg)
- MongoDB (pour la base de données) 💻
![Logo](https://cdn.ttgtmedia.com/visuals/LeMagIT/hero_article/MongoDB.jpg)
- Thunder ou Postman (pour le test des Endpoints)




![Logo](https://i0.wp.com/gowthamcbe.com/wp-content/uploads/2022/03/Thunder-Client-Extension.png?resize=597%2C221&ssl=1)





![Logo](https://media.licdn.com/dms/image/D4D12AQHF10X190224g/article-cover_image-shrink_600_2000/0/1689958597863?e=2147483647&v=beta&t=CXXhcZRkU_x06HQfuMvnMArsBS3Kbb0Y5Hi3eFhtU8E)



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



Conclusion 🚀

La combinaison de JavaScript, gRPC et Apache Kafka offre une architecture robuste et évolutive pour le développement de microservices dans ce projet. Ces technologies permettent une communication efficace, une gestion des flux de données en temps réel et une extensibilité pour répondre aux besoins de l'application.

