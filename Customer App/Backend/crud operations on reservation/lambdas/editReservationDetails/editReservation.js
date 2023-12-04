/**
* edit reservation
*/
const admin = require('firebase-admin');
const axios = require("axios");
 
//Initialize Firebase Admin SDK with  service account credentials
const serviceAccount = require('./serviceAccountKey.json'); // Update with your file path
 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://serverless-term-assignment.firebaseio.com', // Replace with your Firebase project URL
});
 
exports.handler = async (event) =>
{
    try {
            // Initialize Firestore
            const db = admin.firestore();
            
         
             
            console.log("event : ",event); 
            
            const reservationDetails = JSON.parse(event.body);
            //console.log("printing reservation Details   : ", reservationDetails);
            
           /**
             * new reservation details sent in the payload
             */
            const {
                    reservation_id,
                    restaurant_id,
                    //reservationDatePostman,
                    newreservationDate,
                    //required_capacity,
                    no_of_people,
                    user_id,
                }   = reservationDetails;
        
            /*
            console.log("reservation_id ="+ reservation_id);
            console.log("restaurant_id ="+ restaurant_id);
            console.log("reservationDatePostman ="+ reservationDatePostman);
            console.log("required_capacity ="+ required_capacity);
            console.log("user_id ="+ user_id);
            */
 
            const reservationDocRef = db.collection("Customer-Reservation").doc(reservation_id);
 
            //console.log("printing reservationDocRef : ", reservationDocRef + "\n");  
            const reservation = await reservationDocRef.get();
            //console.log("printing reservation : ", reservation);
 
            if (!reservation.exists)
            {
                return {
                        statusCode : 400,
                        headers: {
                             "Content-Type": "application/json",
                              "Access-Control-Allow-Headers": "Content-Type",
                              "Access-Control-Allow-Origin": "*",
                              "Access-Control-Allow-Methods": "POST",
                              "Access-Control-Allow-Credentials": true,
                             },
                        body: JSON.stringify({
                        message: "Restaurant reservation does not exist",
                }),
                };
            }  
 
            const currentReservationData = { ...reservation.data() };
            //console.log("reservation. data() ... ",...reservation.data())
            //console.log("currentReservationData is : ", currentReservationData)
 
 
            //converting the current date to UTC
            const currentDate = new Date();
            console.log("currentDate: ", currentDate);
            
            const currentUtcDate = new Date(
                                            Date.UTC(
                                                currentDate.getUTCFullYear(),
                                                currentDate.getUTCMonth(),
                                                currentDate.getUTCDate(),
                                                currentDate.getUTCHours(),
                                                currentDate.getUTCMinutes(),
                                                currentDate.getUTCSeconds()
                                            )
            );
            
            console.log("currentUtcDate: ", currentUtcDate);
 
            /**
             * accessing the old reservation date
             */
            const currentReservationDate = currentReservationData.reservation_date.toDate();
            //console.log("currentReservationDate : ",currentReservationDate);
            
            // converting the  reservation date to UTC format
            const reservationUtcDate = new Date(
                                                    Date.UTC(
                                                        currentReservationDate.getUTCFullYear(),
                                                        currentReservationDate.getUTCMonth(),
                                                        currentReservationDate.getUTCDate(),
                                                        currentReservationDate.getUTCHours(),
                                                        currentReservationDate.getUTCMinutes(),
                                                        currentReservationDate.getUTCSeconds()
                                                    )
                                                    );
             
            const newReservationDate = new Date(newreservationDate);
            /**
             * checking if the time at which the user is making the request is 1 hour prior to the old booking/reservation time
             */
            if ((reservationUtcDate - currentUtcDate) / (1000 * 60) >= 60)
            {
                const response = await axios.get(
                    `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=${restaurant_id}`
                   
                );
            
                console.log("response ",response);
                const restaurantDetailsBody = response.data.body;
                const restaurantDetails = JSON.parse(restaurantDetailsBody)
                console.log(restaurantDetails);
 
                //console.log(parsedrestaurantDetails.Item.restaurant_id);
                //console.log("restaurantDetails.body .......=====+++++---->>>>",restaurantDetails.body);
                //console.log("currentReservationData.restaurant_id = ",typeof currentReservationData.restaurant_id)
                //console.log("parsedrestaurantDetails.Item.restaurant_id = ",typeof parseInt(parsedrestaurantDetails.Item.restaurant_id));
                
 
                if ( currentReservationData.restaurant_id != restaurantDetails.Item.restaurant_id)
                {
                        return {
                            statusCode : 400,
                                      headers: {
                             "Content-Type": "application/json",
                              "Access-Control-Allow-Headers": "Content-Type",
                              "Access-Control-Allow-Origin": "*",
                              "Access-Control-Allow-Methods": "POST",
                              "Access-Control-Allow-Credentials": true,
                             },
                            body: JSON.stringify({
                            message: "Restaurant does not exist",
                            }),
                        };
                    }
                
    
               
                var daysofweek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const day = newReservationDate;
                //const day = new Date(reservationDatePostman)
                var dayName = daysofweek[day.getDay()];
                console.log("Day name is :",dayName)
        
 
                const restaurantOpening = restaurantDetails.Item.timings[dayName].opening_time;
                const restaurantClosing = restaurantDetails.Item.timings[dayName].closing_time;
                
                const openingHour = parseInt(restaurantOpening.toString().substr(0,2));
                const openingMinute = parseInt(restaurantOpening.toString().substr(2, 4));
 
 
                const closingHour = parseInt(restaurantClosing.toString().substring(0, 2));
                const closingMinute = parseInt(restaurantClosing.toString().substring(2, 4));
 
                // Create opening and closing date from reservation date and restaurant timings
                const openingDate = new Date(newreservationDate);
                const closingDate = new Date(newreservationDate);
                openingDate.setHours(openingHour, openingMinute, 0, 0);
                closingDate.setHours(closingHour, closingMinute, 0, 0);
 
 
            // Adjust for closing times past midnight
                if (restaurantClosing < restaurantOpening)
                {
                    closingDate.setDate(closingDate.getDate() + 1);
                }
                
                console.log("newreservationDate  ++ ==",newreservationDate);
                console.log("openingDate  == ++ ",openingDate);
                console.log("closingDate  ++ == ",closingDate);
 
            if ( newReservationDate >= openingDate && newReservationDate <= closingDate)
            {
                let updatedReservation = {};
 
                if (restaurant_id) {
                    updatedReservation.restaurant_id = restaurant_id;
                }
        
                if (newReservationDate) {
                    updatedReservation.reservation_date =
                    admin.firestore.Timestamp.fromDate(newReservationDate);
                }
        
                if (no_of_people) {
                    updatedReservation.no_of_people = no_of_people;
                }
        
                if (user_id) {
                    updatedReservation.user_id = user_id;
                }
        
                await reservationDocRef.update(updatedReservation);
 
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
                                message: "Reservation successfully edited!"
                            }),
                };
            }
                else{
                    console.log("this is else loop");
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
                            message: "Reservation time is outside the restaurant's opening hours",
                        }),
                    };
                }
            }
            else{
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
                        message:
                        "Reservations can only be edited 1 hour before the reservation time.",
                    }),
                };
            }
            
                }   
        catch (error)
            {
                    console.log(error);
 
                    return{
                        
                        statusCode: 400,
                                  headers: {
                             "Content-Type": "application/json",
                              "Access-Control-Allow-Headers": "Content-Type",
                              "Access-Control-Allow-Origin": "*",
                              "Access-Control-Allow-Methods": "POST",
                              "Access-Control-Allow-Credentials": true,
                             },
                        
                        body: JSON.stringify({
                            error: "Error deleting restaurant reservations",
                            message: error.message,
                        }),
 
                        };
            }
}