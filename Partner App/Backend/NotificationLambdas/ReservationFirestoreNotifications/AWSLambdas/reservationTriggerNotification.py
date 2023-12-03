import json
import boto3
import http.client
from datetime import datetime, timedelta

# Initialize the SNS client
sns = boto3.client('sns')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    new_reservation = body.get('newReservation')
    old_reservation = body.get('oldReservation')
    user_email = body.get('userEmail')
    sns_topic_arn = 'arn:aws:sns:us-east-1:944271984411:ReservationServerlessFilter'

    if new_reservation and not old_reservation:
        action = "created"
        message_details = create_reservation_message(new_reservation)
    elif not new_reservation and old_reservation:
        action = "cancelled"
        message_details = cancel_reservation_message(old_reservation)
    elif new_reservation and old_reservation:
        action = "updated"
        message_details = update_reservation_message(new_reservation, old_reservation)
    else:
        return {'statusCode': 400, 'body': json.dumps('Invalid reservation data.')}

    if new_reservation:
        restaurant_id = new_reservation['restaurant_id']
        restaurant_email = fetch_restaurant_email(restaurant_id)
    else:
        restaurant_email = None



    if user_email:
        user_message = format_message(new_reservation, action, "customer", message_details)
        ensure_subscription(user_email, sns_topic_arn)
        send_direct_email_notification(user_email, user_message, sns_topic_arn)

    if restaurant_email:
        restaurant_message = format_message(new_reservation, action, "restaurant", message_details)
        ensure_subscription(restaurant_email, sns_topic_arn)
        send_direct_email_notification(restaurant_email, restaurant_message, sns_topic_arn)

    return {'statusCode': 200, 'body': json.dumps('Notifications sent successfully.')}



def fetch_restaurant_email(restaurant_id):
    conn = http.client.HTTPSConnection("2iqvxzgo50.execute-api.us-east-1.amazonaws.com")
    conn.request("GET", f"/dev/restaurant?restaurantId={restaurant_id}")
    
    response = conn.getresponse()
    if response.status == 200:
        data = json.loads(response.read().decode())
        return data.get('Item', {}).get('creator_email')
    return None


def send_direct_email_notification(email, message,sns_topic_arn):
    message_attributes = {
        'email': {
            'DataType': 'String',
            'StringValue': email
        }
    }

    sns.publish(
        TopicArn=sns_topic_arn,
        Message=message,
        Subject="Reservation Notification",
        MessageAttributes=message_attributes
    )

def create_reservation_message(reservation):
    return (f"We're excited to confirm your reservation for {reservation['required_capacity']} guests "
            f"on {format_timestamp(reservation['reservation_date'])}! 🍽️ See you soon!")

def cancel_reservation_message(reservation):
    return f"We're sorry to see you go! Your reservation for {reservation['required_capacity']} on {format_timestamp(reservation['reservation_date'])} has been cancelled."

def update_reservation_message(new_reservation, old_reservation):
    updates = []
    if new_reservation['required_capacity'] != old_reservation['required_capacity']:
        updates.append(f"changed the number of guests from {old_reservation['required_capacity']} to {new_reservation['required_capacity']}")
    if new_reservation['reservation_date'] != old_reservation['reservation_date']:
        updates.append(f"rescheduled from {format_timestamp(old_reservation['reservation_date'])} to {format_timestamp(new_reservation['reservation_date'])}")
    return f"We've updated your reservation: {' and '.join(updates)}."


def format_timestamp(timestamp):
    # Convert the timestamp (in seconds) to a UTC datetime object
    date_time_utc = datetime.utcfromtimestamp(timestamp['_seconds'])

    # Halifax is UTC -4
    halifax_offset = timedelta(hours=-4)
    date_time_halifax = date_time_utc + halifax_offset

    # Format the datetime object to a readable string format
    # Example format: "12 March 2023, 15:00"
    readable_format = date_time_halifax.strftime("%d %B %Y, %H:%M")
    return readable_format

# Function to ensure subscription with filter policy
def ensure_subscription(email, sns_topic_arn):
   if email:
        subscriptions = sns.list_subscriptions_by_topic(TopicArn=sns_topic_arn)
        if not any(sub['Endpoint'] == email for sub in subscriptions['Subscriptions']):
            filter_policy = {"email": [email]}
            sns.subscribe(
                TopicArn=sns_topic_arn,
                Protocol='email',
                Endpoint=email,
                Attributes={'FilterPolicy': json.dumps(filter_policy)}
            )

def format_message(reservation, action, recipient_type, message_details):
    details = ""
    if recipient_type == "customer":
        details = f"📅 Reservation Date: {format_timestamp(reservation['reservation_date'])}\n"
        details += f"👥 Guests: {reservation['required_capacity']}\n"
        details += f"🏠 Restaurant: {reservation['restaurant_name']}\n"
    elif recipient_type == "restaurant":
        details = f"🚀 A new reservation has been {action}!\n"
        details += f"👥 Guests: {reservation['required_capacity']}\n"
        details += f"📅 Date: {format_timestamp(reservation['reservation_date'])}\n"
    
    details += message_details  # Include the message_details here.

    greeting = "Hello! " if recipient_type == "restaurant" else "Hi there! "
    emoji = "🌟" if action == "created" else "❌" if action == "cancelled" else "✏️"

    return f"{greeting}{emoji} {details}"
