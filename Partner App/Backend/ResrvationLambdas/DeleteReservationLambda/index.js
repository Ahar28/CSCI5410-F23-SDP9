/**
 * PARTNER APP
 * DELETE reservation for
 */

const admin = require("firebase-admin");
//const axios = require("axios");

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require("./serviceAccountKey.json"); // Update with your file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-term-assignment.firebaseio.com", // Replace with your Firebase project URL
});

exports.handler = async (event) => {
  try {
    // Initialize Firestore
    const db = admin.firestore();
    console.log("event : ", event);

    const reservationId = event["queryStringParameters"]["reservation_id"];

    // Reference to the Firestore collection
    const reservationDocRef = db
      .collection("Customer-Reservation")
      .doc(reservationId); // collection name
    //console.log("printing docref  =  "+ JSON.stringify(reservationDocRef));

    const reservation = await reservationDocRef.get();

    console.log("reservation = " + JSON.stringify(reservation));

    if (!reservation.exists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Restaurant reservation does not exist",
        }),
      };
    }

    await reservationDocRef.delete();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Reservation successfully deleted!",
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Error deleting restaurant reservations",
        message: error.message,
      }),
    };
  }
};
