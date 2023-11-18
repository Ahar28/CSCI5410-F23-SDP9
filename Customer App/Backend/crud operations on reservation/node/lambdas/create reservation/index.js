/**
 * create reservation
 */
const admin = require("firebase-admin");
const axios = require("axios");

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

    const reservationDetails = JSON.parse(event.body);
    const { restaurantId, reservationDate, requiredCapacity, userId } =
      reservationDetails;

    const newReservationDate = new Date(reservationDate);

    const response = await axios.get(
      `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=2`
    );

    const restaurantDetails = response.data;

    if (restaurantId !== restaurantDetails.restaurant_id) {
      // return Responses._400({
      //   message: "The restaurant does not exist",
      // });
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "The restaurant does not exist",
        }),
      };
    }

    const restaurantOpening = restaurantDetails.opening_time;
    const restaurantClosing = restaurantDetails.closing_time;
    const [openingHour, openingMinute] = restaurantOpening
      .split(":")
      .map(Number);
    const [closingHour, closingMinute] = restaurantClosing
      .split(":")
      .map(Number);

    // Create opening and closing date from reservation date and restaurant timings
    const openingDate = new Date(newReservationDate);
    const closingDate = new Date(newReservationDate);
    openingDate.setHours(openingHour, openingMinute, 0, 0);
    closingDate.setHours(closingHour, closingMinute, 0, 0);

    // Adjust for closing times past midnight
    if (restaurantClosing < restaurantOpening) {
      closingDate.setDate(closingDate.getDate() + 1);
    }

    if (
      newReservationDate >= openingDate &&
      newReservationDate <= closingDate
    ) {
      const reservationsDocs = db.collection("Customer-Reservation");
      const addedReservation = await reservationsDocs.add({
        restaurant_id: restaurantId,
        reservation_date:
          admin.firestore.Timestamp.fromDate(newReservationDate),
        required_capacity: requiredCapacity,
        user_id: userId,
      });

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
          message: "Your Reservation has been made successfully",
          reservation_id: addedReservation.id,
        }),
      };
    } else {
 
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Reservation time is outside the restaurant's opening hours",
        }),
      };
    }
  } catch (error) {
    console.log(error);
    
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Reservation time is outside the restaurant's opening hours",
      }),
    };
  }
  /*
    // Data to be added to the Firestore document
    const dataToStore = {
      user_id: event.user_id, // Replace with the actual data you want to store
      restaurant_id: event.restaurant_id,
      no_of_people: event.no_of_people,
      //timestamp: new Date().toISOString(),
      // Add other data fields as needed
    };

    console.log("data to store json " + JSON.stringify(dataToStore))

    // Reference to the Firestore collection
    const collectionRef = db.collection('Customer-Reservation'); // Replace with your collection name

    // Add a new document with a generated ID  
    const docRef = await collectionRef.add(dataToStore);
  
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Reservation made successfully ',
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
  } */
};
