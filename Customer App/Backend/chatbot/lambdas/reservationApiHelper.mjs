import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const admin = require('firebase-admin');
const serviceAccount = require('/opt/nodejs/serviceAccountKey.json'); // Update with your file path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://serverless-term-assignment.firebaseio.com', // Replace with your Firebase project URL
});
const db = admin.firestore();

export const getReservationsByRestaurant = async (restaurant_id) => {
  console.log("getting data");
  const collectionRef = db.collection('Customer-Reservation'); // collection name
  console.log("getting collectionRef",restaurant_id);
  const docRef = await collectionRef.where('restaurant_id','==', parseInt(restaurant_id)).get();
  console.log("getting docRef");
  console.log(docRef)
  return docRef;
}


export const handler = async (event) => {
  try {
    
    // success reponse message
    let docRef = null;
    if (event['function'] === 'getReservationsByRestaurant'){
      docRef = await getReservationsByRestaurant(event['restaurant_id'])
    }
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: {
        message: 'Document retreived successfully',
        document: docRef.docs.map(doc => doc.data()),
      },
    };
  } catch (error) {
    // error reponse message
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({
        error: 'Failed to retreive document',
        message: error.message,
      }),
    };
  }
};
