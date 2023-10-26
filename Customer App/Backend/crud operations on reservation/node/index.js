  const admin = require('firebase-admin');

  // Initializing Firebase Admin SDK with service account credentials
  const serviceAccount = require('./serviceAccountKey.json'); // file path for service account credentials
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://serverless-term-assignment.firebaseio.com', // Firebase project URL
  });

  exports.handler = async (event, context) => {
    try {
      // Initialize Firestore
      const db = admin.firestore();
    
      // Data to be added to the Firestore document
      const dataToStore = {
        user_id: event.user_id, 
        restaurant_id: event.restaurant_id,
        no_of_people: event.no_of_people,
        //timestamp: new Date().toISOString(),
        //  other data fields to be added as needed
      };

      // Reference to the Firestore collection
      const collectionRef = db.collection('Customer-Reservation'); // collection name
      
      // Add a new document with an auto generated ID
      const docRef = await collectionRef.add(dataToStore);

      // return message
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Document added successfully',
          document_id: docRef.id,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to add document',
          message: error.message,
        }),
      };
    }
  };