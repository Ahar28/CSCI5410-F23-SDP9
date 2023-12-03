const axios = require('axios');
const admin = require('firebase-admin');
const AWS = require('aws-sdk');

// Initialize Firebase Admin with your service account
const serviceAccount = require('./serviceKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-term-assignment.firebaseio.com"
});

// Initialize AWS SNS
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    // Fetch users from Firebase Authentication
    const userRecords = await admin.auth().listUsers();
    const userEmails = userRecords.users.map((user) => user.email);

    // Fetch the existing subscriptions for the SNS topic
    const topicArn = 'arn:aws:sns:us-east-1:944271984411:ServerlessHourlyNotification';
    const existingSubscriptions = await sns.listSubscriptionsByTopic({ TopicArn: topicArn }).promise();

    // Extract the email addresses of existing subscriptions
    const existingSubscribers = existingSubscriptions.Subscriptions.map((subscription) => subscription.Endpoint);

    // Filter out users who are already subscribed
    const newSubscribers = userEmails.filter((userEmail) => !existingSubscribers.includes(userEmail));

    // Subscribe each new user email to the SNS topic
    for (const newUserEmail of newSubscribers) {
      const params = {
        Protocol: 'email',
        TopicArn: topicArn,
        Endpoint: newUserEmail
      };
      await sns.subscribe(params).promise();
    }

    // Fetch restaurant data
    const headers = { "Content-Type": "application/json" };
    const response = await axios.get('https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurants/list', { headers });
    if (response.status !== 200) {
      throw new Error('Failed to fetch restaurant data.');
    }

    const restaurants = JSON.parse(response.data.body);
    const currentHour = new Date().getHours();
    const openRestaurants = restaurants.filter(restaurant => {
      const openingTime = parseInt(restaurant.available_times?.opening_time.toString().substring(0, 2));
      const closingTime = parseInt(restaurant.available_times?.closing_time.toString().substring(0, 2));
      return restaurant.is_open && currentHour >= openingTime && currentHour < closingTime;
    });

// Construct the notification message
let notificationMessage = '🌟 𝗥𝗲𝗰𝗲𝗻𝘁 𝗼𝗳𝗳𝗲𝗿𝘀 𝗮𝗻𝗱 𝗼𝗽𝗲𝗻𝗶𝗻𝗴𝘀:\n\n';
openRestaurants.forEach(restaurant => {
  notificationMessage += `🍽️ 𝗥𝗲𝘀𝘁𝗮𝘂𝗿𝗮𝗻𝘁 𝗡𝗮𝗺𝗲: ${restaurant.restaurant_name}, 𝗢𝗳𝗳𝗲𝗿: ${restaurant.restaurant_offer || 'No special offer'}\n`;
});

notificationMessage += '\n';
// Add a section for "Restaurants opened this hour"
    notificationMessage += '\nRestaurants opened this hour:\n';
    openRestaurants.forEach(restaurant => {
      const openingHour = parseInt(restaurant.available_times?.opening_time.toString().substring(0, 2));
      if (openingHour === currentHour) {
        notificationMessage += `🍽️ 𝗥𝗲𝘀𝘁𝗮𝘂𝗿𝗮𝗻𝘁 𝗡𝗮𝗺𝗲: ${restaurant.restaurant_name || 'No restaurants opened this hour'}\n`;
      }
    });

// Send a single notification to the SNS topic
const message = {
  Subject: '🎉 Restaurants Open Now and New Offers!!!',
  Message: notificationMessage,
  TopicArn: 'arn:aws:sns:us-east-1:944271984411:ServerlessHourlyNotification'
};
await sns.publish(message).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notifications sent and subscriptions initiated' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
