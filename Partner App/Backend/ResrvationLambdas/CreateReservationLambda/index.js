/**
 * PARTNER APP
 * CREATE RESERVATION
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
    
    const db = admin.firestore(); // Initialize Firestore
    console.log("event is: ", event);
    console.log("type of event.body is : ",typeof(event.body)," event.body :",event.body);
    
    //const reservationDetails = JSON.parse(event);
    const reservationDetails = JSON.parse(event.body);

    const { restaurant_id, reservationDate, no_of_people, user_id } = reservationDetails;
    
    console.log(" type of reservationDetails :",typeof(reservationDetails));
    
    const rest_id = reservationDetails.restaurant_id;
    
    
    const newReservationDate = new Date(reservationDate);
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    
    const day = newReservationDate;
    var dayName = days[day.getDay()];
    
    //console.log(dayName);

    const response = await axios.get(
      `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=${rest_id}`
    );
    console.log("restaurantDetails response : ",response);
    
    const restaurantDetails = JSON.parse(response.data.body);
    
    console.log("restaurantDetails :",restaurantDetails);
    
    if (restaurant_id !== restaurantDetails.Item.restaurant_id) {
      return {
        statusCode: 400,
        message: "The restaurant does not exist",
      };
    }

if (restaurantDetails.Item && restaurantDetails.Item.timings) {
  
    const restaurantOpening =
      restaurantDetails.Item.timings[dayName]?.opening_time;
    const restaurantClosing =
      restaurantDetails.Item.timings[dayName]?.closing_time;
      
    console.log("restaurant opening time ====== " + restaurantOpening);

    const openingHour = parseInt(restaurantOpening.toString().substr(0, 2));
    const openingMinute = parseInt(restaurantOpening.toString().substr(2, 4));

    const closingHour = parseInt(restaurantClosing.toString().substring(0, 2));
    const closingMinute = parseInt(
      restaurantClosing.toString().substring(2, 4)
    );

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
        restaurant_id: restaurant_id,
        reservation_date:
          admin.firestore.Timestamp.fromDate(newReservationDate),
        required_capacity: no_of_people,
        user_id: user_id,
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
          message: "Reservation made successfully ",
          document_id: addedReservation.id,
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
}
  else{
    
     const reservationsDocs = db.collection("Customer-Reservation");
      const addedReservation = await reservationsDocs.add({
        restaurant_id: restaurant_id,
        reservation_date:
          admin.firestore.Timestamp.fromDate(newReservationDate),
        required_capacity: no_of_people,
        user_id: user_id,
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
          message: "Reservation made successfully ",
          document_id: addedReservation.id,
        }),
      };
    
  }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to add document",
        message: error.message,
      }),
    };
  }
};