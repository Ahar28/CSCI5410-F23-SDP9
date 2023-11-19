const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);


exports.hourlyReservationCheck = functions.pubsub
    .schedule("every 60 minutes")
    .onRun(async (context) => {
      const now = admin.firestore.Timestamp.now();
      const oneHourLater = new admin.firestore.Timestamp(
          now.seconds + 3600, now.nanoseconds);
      const reservations = await admin.firestore().collection("reservations")
          .where("reservationTime", ">=", now)
          .where("reservationTime", "<=", oneHourLater)
          .where("hasMenu", "==", true)
          .get();

      reservations.docs.forEach(async (doc) => {
        const res = doc.data();
        const subject = "Reservation in 1 Hour 🕒";
        const emailBody = "Reminder: Reservation with menu in 1 hr.\n\n" +
        "Details: Name: " + res.customerName + ", Time: " +
        new Date(res.reservationTime.toMillis()).toString() +
        ", Guests: " + res.numberOfGuests + ". Prepare menu!";
        if (res.restaurantId) {
          const restaurantRef = admin.firestore().doc(
              `restaurants/${res.restaurantId}`);
          const restaurantSnap = await restaurantRef.get();
          if (restaurantSnap.exists) {
            const restaurantData = restaurantSnap.data();
            const msg = {to: restaurantData.email, from: "ab916813@dal.ca",
              subject: subject, text: emailBody};
            await sgMail.send(msg);
          }
        }
      });
      return null;
    });

