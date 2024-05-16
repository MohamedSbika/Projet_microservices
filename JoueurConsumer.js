const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'joueur-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'joueur-group' });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'joueur-events', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log('Received joueur event:', event);
        // Traitez l'événement d'équipe ici en fonction de l'événement reçu (création, modification, suppression, etc.)
        // Exemple : Appelez les fonctions appropriées pour gérer les événements d'équipe
        switch (event.eventType) {
          case 'creation':
            handleJoueurCreation(event.joueurData);
            break;
          case 'modification':
            handleJoueurModification(event.joueurData);
            break;
          case 'suppression':
            handleJoueurSuppression(event.joueurData);
            break;
          default:
            console.warn('Event type not recognized:', event.eventType);
        }
      },
    });
  } catch (error) {
    console.error('Error with Kafka consumer:', error);
  }
};

const handleJoueurCreation = (joueurData) => {
  console.log('Handling joueur creation event:', joueurData);
  // Logique pour gérer la création d'équipe ici
};

const handleJoueurModification = (joueurData) => {
  console.log('Handling joueur modification event:', joueurData);
  // Logique pour gérer la modification d'équipe ici
};

const handleJoueurSuppression = (joueurData) => {
  console.log('Handling joueur suppression event:', joueurData);
  // Logique pour gérer la suppression d'équipe ici
};

run().catch(console.error);
