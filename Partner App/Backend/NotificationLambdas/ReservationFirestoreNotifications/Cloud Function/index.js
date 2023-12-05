const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.notifyReservationChange = functions.firestore
    .document("Customer-Reservation/{documentId}")
    .onWrite(async (change, context) => {
      const newReservation = change.after.exists ? change.after.data() : null;
      const oldReservation = change.before.exists ? change.before.data() : null;

      console.log("New Reservation Data:", newReservation);
      console.log("Old Reservation Data:", oldReservation);

      // Initialize userEmail and restaurantEmail
      let userEmail = '';
      let restaurantEmail = '';

      // Get userId and restaurantId
      const userId = newReservation ? newReservation.user_id : (oldReservation ? oldReservation.user_id : null);
      const restaurantId = newReservation ? newReservation.restaurant_id : (oldReservation ? oldReservation.restaurant_id : null);

      // Fetch user email
      if (userId) {
        try {
          const userRecord = await admin.auth().getUser(userId);
          userEmail = userRecord.email;
          console.log("User email:", userEmail);
        } catch (error) {
          console.error("Error fetching user email:", error.message);
        }
      }

      // Fetch restaurant email from the restaurant API
      if (restaurantId) {
        try {
          const restaurantApiUrl = `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=${restaurantId}`;
          const restaurantApiResponse = await axios.get(restaurantApiUrl, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const restaurantResponseBody = JSON.parse(restaurantApiResponse.data.body);
          restaurantEmail = restaurantResponseBody.Item && restaurantResponseBody.Item.creator_email ? restaurantResponseBody.Item.creator_email : '';
          console.log("Restaurant email:", restaurantEmail);
        } catch (error) {
          console.error("Error fetching restaurant email:", error.message);
        }
      }

      // Prepare request body
      const requestBody = {
        newReservation: newReservation,
        oldReservation: oldReservation,
        userEmail: userEmail,
        restaurantEmail: restaurantEmail,
        reservationId: context.params.documentId,
      };

      const apiUrl = "https://l2yn9o3m7i.execute-api.us-east-1.amazonaws.com/test/sendData";
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        // Send the request body as a JSON string
        const response = await axios.post(apiUrl, requestBody, config);
        console.log("Data sent. Response:", response.data);
        return null;
      } catch (error) {
        console.error("Error sending data to the API:", error.message);
        return null;
      }
    });

