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

      // Check if newReservation has user_id and fetch user email
      let userEmail = '';
      if (newReservation && newReservation.user_id) {
        try {
          const userRecord = await admin.auth().getUser(newReservation.user_id);
          userEmail = userRecord.email;
          console.log("User email:", userEmail);
        } catch (error) {
          console.error("Error fetching user email:", error.message);
        }
      }

      // Wrap the data to send in an object with a 'body' key
      const requestBody = {
        body: JSON.stringify({
          newReservation: newReservation,
          oldReservation: oldReservation,
          userEmail: userEmail, // Include userEmail in the data being sent
          reservationId: context.params.documentId,
        }),
      };

      const apiUrl = "https://y2negp2yw9.execute-api.us-east-1.amazonaws.com/dev/sendData";
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

