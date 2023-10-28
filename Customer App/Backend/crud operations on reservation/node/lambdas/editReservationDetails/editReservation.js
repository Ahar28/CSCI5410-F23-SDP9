/**
* edit reservation
*/
const admin = require('firebase-admin');
const axios = require("axios");
 
// Initialize Firebase Admin SDK with your service account credentials
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
            //console.log("printing event ====+++ ",event, "+++====","\n");
            
            const reservationDetails = JSON.parse(event.body);
            console.log("printing reservation Details  : "+ reservationDetails);
            
            const {
                    reservation_id,
                    restaurant_id,
                    reservationDate,
                    no_of_people,
                    user_id,
                }   = reservationDetails;
 
            console.log("Printing values after getting and storing : \n");
            console.log("reservation_id ="+ reservation_id);
            console.log("restaurant_id ="+ restaurant_id);
            console.log("reservationDate ="+ reservationDate);
            console.log("no_of_people ="+ no_of_people);
            console.log("user_id ="+ user_id);
 
            const reservationDocRef = db.collection("Customer-Reservation").doc(reservation_id);
 
            console.log("printing reservationDocRef : "+ reservationDocRef + "\n");  
            const reservation = await reservationDocRef.get();
            console.log("printing reservation : ", reservation);
 
            if (!reservation.exists)
            {
                return {
                        statusCode : 400,
                        
                        body: JSON.stringify({
                        message: "Restaurant reservation does not exist",
                }),
                
                };
            }  
            console.log("+++testing++++")      
            const currentReservationData = { ...reservation.data() };
            //console.log("reservation. data() ... ",...reservation.data())
            console.log("currentReservationData is : ")
            console.log(currentReservationData);
 
            const currentDate = new Date();
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
 
            const currentReservationDate = currentReservationData.reservation_date.toDate();
            console.log("currentReservationDate : ",currentReservationDate);
            
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
             
 
 
            if ((reservationUtcDate - currentUtcDate) / (1000 * 60) >= 60)
            {
                const response = await axios.get(
                    `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=${restaurant_id}`
                    //change here
                );
                
                console.log("response is  : \n", response.data);
                const restaurantDetails = response.data;
                
 
                if ( currentReservationData.restaurant_id !== restaurantDetails.Item.restaurant_id )
                    {
                        return {
                            statusCode : 400,
                            body: JSON.stringify({
                            message: "Restaurant does not exist",
                            }),
                        };
                    }
                
                const newReservationDate = new Date(reservationDate);
                var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const day = newReservationDate;
                var dayName = days[day.getDay()];
                console.log("Day name is :",dayName)
        
                const restaurantOpening = restaurantDetails.Item.timings[dayName].opening_time;
                const restaurantClosing = restaurantDetails.Item.timings[dayName].closing_time;
                
                const openingHour = parseInt(restaurantOpening.toString().substr(0,2));
                const openingMinute = parseInt(restaurantOpening.toString().substr(2, 4));
 
 
                const closingHour = parseInt(restaurantClosing.toString().substring(0, 2));
                const closingMinute = parseInt(restaurantClosing.toString().substring(2, 4));
 
                // Create opening and closing date from reservation date and restaurant timings
                const openingDate = new Date(newReservationDate);
                const closingDate = new Date(newReservationDate);
                openingDate.setHours(openingHour, openingMinute, 0, 0);
                closingDate.setHours(closingHour, closingMinute, 0, 0);
 
            // Adjust for closing times past midnight
                if (restaurantClosing < restaurantOpening)
                {
                    closingDate.setDate(closingDate.getDate() + 1);
                }
 
            if ( newReservationDate >= openingDate && newReservationDate <= closingDate)
            {
                let updatedReservation = {};
 
                if (restaurantId) {
                    updatedReservation.restaurant_id = restaurantId;
                }
        
                if (newReservationDate) {
                    updatedReservation.reservation_date =
                    admin.firestore.Timestamp.fromDate(newReservationDate);
                }
        
                if (requiredCapacity) {
                    updatedReservation.required_capacity = requiredCapacity;
                }
        
                if (userId) {
                    updatedReservation.user_id = userId;
                }
        
                await reservationDocRef.update(updatedReservation);
 
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "Reservation successfully edited!"
                    }),
                };
            }
                else{
                    return {
                        statusCode: 400,
                        body: JSON.stringify({
                            message: "Reservation time is outside the restaurant's opening hours",
                        }),
                    };
                }
            }
            else{
                return {
                    statusCode: 400,
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
                        
                        body: JSON.stringify({
                            error: "Error deleting restaurant reservations",
                            message: error.message,
                        }),
 
                        };
            }
}
 