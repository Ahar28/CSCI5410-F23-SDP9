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
    console.log("+++++++++++++++++++++++++++=");
    const db = admin.firestore();
    console.log("event is ++== ", event);
    console.log("event body is ++== ", event.body);
    console.log("type of event.body: ",typeof(event.body))
    console.log("before json.parse");
    const reservationDetails = JSON.parse(event.body);
  //  const reservationDetails = event.body;
    console.log("after json.parse");
    
    const { restaurant_id, reservationDate, no_of_people, user_id, user_email,restaurant_name
    //new
      , selectedMenuItems, 
    } =
      reservationDetails;

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
    console.log("restaurant_id is:",restaurant_id);
    console.log("fetching restaurant  details from restaurant_id");
    const response = await axios.get(
      `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=${restaurant_id}`
    );
  
    console.log("response: ",response);
    console.log("response.data: ",response.data);
    console.log("response.data.body : ",response.data.body);
    
    console.log("data of response.data.body : ",typeof(response.data.body));
    
    
    const restaurantDetails = JSON.parse(response.data.body);
    // console.log("restaurantDetails after calling the get api ",restaurantDetails);
    // console.log("type of restaurantDetails.Item :",typeof(restaurantDetails.Item));
    // console.log("restaurant_id sent in the request :",restaurant_id);
    // console.log("restaurant_id form the api call: ",restaurantDetails.restaurant_id);

    if (restaurant_id !== restaurantDetails.Item.restaurant_id) {
      console.log("restaurant_ids dont match match :")
      return {
        statusCode: 400,
            headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Credentials": true,
        },
         body: JSON.stringify({
          message: "The restaurant does not exist ",
        
        }),
      
      };
    }

    const restaurantOpening =
      restaurantDetails.Item.timings[dayName].opening_time;
    const restaurantClosing =
      restaurantDetails.Item.timings[dayName].closing_time;
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
        user_email:user_email,
        restaurant_name,
        
        selectedMenuItems: selectedMenuItems || [], // Store selectedMenuItems or an empty array if it's null/undefined
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
