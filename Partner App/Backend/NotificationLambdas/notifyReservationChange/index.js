const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.notifyReservationChange = functions.firestore
    .document("reservations/{reservationId}")
    .onWrite(async (change, context) => {
      const reservation = change.after.exists ? change.after.data() : null;
      const oldReservation = change.before.exists ? change.before.data() : null;
      let emailBody = ""; let subject = "Reservation Update";

      if (!oldReservation && reservation) {
        subject = "New Reservation Booked 📅";
        emailBody = `Dear Team, New booking by ${reservation.customerName}.` +
        ` Time: ${reservation.reservationTime}, Guests: ` +
        `${reservation.numberOfGuests}, Requests: ` +
        `${reservation.specialRequests || "None"}, Contact: ` +
        `${reservation.contactInfo}. Welcome guests!`;
      } else if (oldReservation && !reservation) {
        subject = "Reservation Cancelled ❌";
        emailBody = `Attention: Cancelled by ${oldReservation.customerName}.` +
        ` Time: ${oldReservation.reservationTime}, Guests: ` +
        `${oldReservation.numberOfGuests}. No action needed.`;
      } else if (oldReservation && reservation) {
        subject = "Reservation Modified ✏️";
        emailBody = `Heads up! Modified by ${reservation.customerName}.` +
        ` New Time: ${reservation.reservationTime}, Guests: ` +
        `${reservation.numberOfGuests}, Requests: ` +
        `${reservation.specialRequests || "None"}. Update plans.`;
      }

      if (reservation && reservation.restaurantId) {
        const restaurantRef = admin.firestore().doc(
            `restaurants/${reservation.restaurantId}`);
        const restaurantSnap = await restaurantRef.get();
        if (restaurantSnap.exists) {
          const restaurantData = restaurantSnap.data();
          const msg = {to: restaurantData.email, from: "ab916813@dal.ca",
            subject: subject, text: emailBody};
          return sgMail.send(msg);
        }
      }
      return null;
    });


