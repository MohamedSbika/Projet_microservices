const { gql } = require('@apollo/server');

const typeDefs = `
  type Equipe {
    id: String!
    nom: String!
    description: String!
  }

  type Joueur {
    id: String!
    nom: String!
    poste: String!
  }

  type Query {
    equipe(id: String!): Equipe
    equipes: [Equipe]
    joueur(id: String!): Joueur
    joueurs: [Joueur]
  }
  
  type Mutation {
    createEquipe(nom: String!, description: String!): Equipe
    deleteEquipeById(id: String!): Equipe
    updateEquipeById(id: String!, input: EquipeInput!): Equipe
    createJoueur(nom: String!, poste: String!): Joueur
    deleteJoueurById(id: String!): Joueur
    updateJoueurById(id: String!, input: JoueurInput!): Joueur
  }
  input JoueurInput {
    nom: String
    poste: String
  }
  input EquipeInput {
    nom: String
    description: String
  }  
`;


module.exports = typeDefs;
