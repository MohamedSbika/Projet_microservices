const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'equipe-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'equipe-group' });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'equipe-events', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log('Received equipe event:', event);
        // Traitez l'événement d'équipe ici en fonction de l'événement reçu (création, modification, suppression, etc.)
        // Exemple : Appelez les fonctions appropriées pour gérer les événements d'équipe
        switch (event.eventType) {
          case 'creation':
            handleEquipeCreation(event.equipeData);
            break;
          case 'modification':
            handleEquipeModification(event.equipeData);
            break;
          case 'suppression':
            handleEquipeSuppression(event.equipeData);
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

const handleEquipeCreation = (equipeData) => {
  console.log('Handling equipe creation event:', equipeData);
  // Logique pour gérer la création d'équipe ici
};

const handleEquipeModification = (equipeData) => {
  console.log('Handling equipe modification event:', equipeData);
  // Logique pour gérer la modification d'équipe ici
};

const handleEquipeSuppression = (equipeData) => {
  console.log('Handling equipe suppression event:', equipeData);
  // Logique pour gérer la suppression d'équipe ici
};

run().catch(console.error);
