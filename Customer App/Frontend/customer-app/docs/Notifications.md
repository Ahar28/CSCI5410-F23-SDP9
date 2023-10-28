# Hourly Notifications System

This documentation outlines the architecture and workflow of the Hourly Notifications feature in our system, designed to notify users about new offers and opening restaurants on an hourly basis.

## Backend

### DynamoDB Tables

We have two DynamoDB tables: `Offers` and `RestaurantInfo`. 
- The `Offers` table contains information about new offers.
- The `RestaurantInfo` table has details about restaurant opening hours.

### AWS Lambda Function

- The `HourlyNotificationLambda` function is scheduled to run every hour.
- When triggered, it scans the `Offers` and `RestaurantInfo` tables in DynamoDB to fetch new offers and opening restaurants for the current hour.
- It then formats this information into a message which is ready to be sent to the frontend.

### Amazon SNS (Simple Notification Service)

- The Lambda function publishes this message to an SNS topic named `HourlyNotificationsTopic`.

### API Gateway (WebSocket)

- We have an API Gateway WebSocket API set up to facilitate real-time communication between the backend and frontend.
- The `WebSocketNotificationLambda` function, which is subscribed to the SNS topic, receives the message from SNS and sends it to connected clients via the WebSocket connection using the API Gateway Management API.

## Frontend

### React Application

- In the React application, we have a component named `NotificationSubscriber`.
- This component establishes a WebSocket connection to the backend via the API Gateway WebSocket URL on component mount.
- It sets up a listener for messages on this WebSocket connection.
- When a message is received, it updates the UI to display the new notifications.
- Notifications are shown in a floating window that can be toggled open and closed by the user.

## Flow of Notifications

1. Every hour, the `HourlyNotificationLambda` function is triggered, which fetches new offers and opening restaurants, and publishes a message to the `HourlyNotificationsTopic` SNS topic.
2. The `WebSocketNotificationLambda` function, subscribed to this SNS topic, receives this message and sends it via WebSocket to the frontend.
3. The `NotificationSubscriber` component in the frontend receives this message via the WebSocket connection and updates the UI to display the new notifications in a floating window.

