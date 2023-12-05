import json
import boto3
from datetime import datetime, timedelta

sns = boto3.client('sns')
customer_sns_topic_arn = 'arn:aws:sns:us-east-1:944271984411:CustomerNotifications'
restaurant_sns_topic_arn = 'arn:aws:sns:us-east-1:944271984411:RestaurantNotifications'


def lambda_handler(event, context):
    new_reservation = event.get('newReservation')
    old_reservation = event.get('oldReservation')
    user_email = event.get('userEmail')
    restaurant_email = event.get('restaurantEmail')

    action, message_details = determine_action_and_message(new_reservation, old_reservation)

    # Determine which reservation to use for message formatting
    reservation_for_message = new_reservation if new_reservation else old_reservation

    # Notify customer
    if user_email:
        user_message = format_message(reservation_for_message, action, "customer", message_details)
        ensure_subscription(user_email, "customer")  # Corrected to use recipient type
        send_direct_email_notification(user_email, user_message, "customer")

    # Notify restaurant
    if restaurant_email:
        restaurant_message = format_message(reservation_for_message, action, "restaurant", message_details)
        ensure_subscription(restaurant_email, "restaurant")  # Corrected to use recipient type
        send_direct_email_notification(restaurant_email, restaurant_message, "restaurant")
        
    return {'statusCode': 200, 'body': json.dumps(user_email)}


def determine_action_and_message(new_reservation, old_reservation):
  
    if not new_reservation and old_reservation:
        return "cancelled", cancel_reservation_message(old_reservation)
    elif new_reservation and old_reservation:
        return "updated", update_reservation_message(new_reservation, old_reservation)
    return 'unknown', 'No valid reservation data.'


def cancel_reservation_message(reservation):
    return f"We're sorry to see you go! Your reservation for {reservation['no_of_people']} on {format_timestamp(reservation['reservation_date'])} has been cancelled."

def update_reservation_message(new_reservation, old_reservation):
    updates = []
    if new_reservation['no_of_people'] != old_reservation['no_of_people']:
        updates.append(f"changed the number of guests from {old_reservation['no_of_people']} to {new_reservation['no_of_people']}")
    

    if new_reservation['reservation_date'] != old_reservation['reservation_date']:
        updates.append(f"rescheduled from {format_timestamp(old_reservation['reservation_date'])} to {format_timestamp(new_reservation['reservation_date'])}")

    if 'selectedMenuItems' in new_reservation and 'selectedMenuItems' in old_reservation:
        new_items = {item['name']: item for item in new_reservation['selectedMenuItems']}
        old_items = {item['name']: item for item in old_reservation['selectedMenuItems']}
        for item_name, new_item in new_items.items():
            if item_name not in old_items:
                updates.append(f"added menu item '{item_name}'")
            elif new_item['quantity'] != old_items[item_name]['quantity']:
                updates.append(f"changed quantity of '{item_name}' from {old_items[item_name]['quantity']} to {new_item['quantity']}")
        for item_name in old_items:
            if item_name not in new_items:
                updates.append(f"removed menu item '{item_name}'")

    return f"We've updated your reservation: {'; '.join(updates)}."

def format_timestamp(timestamp):
    # If timestamp is already an integer, use it directly
    if isinstance(timestamp, int):
        date_time_utc = datetime.utcfromtimestamp(timestamp)
    else:
        # If timestamp is a dictionary, use the '_seconds' key
        date_time_utc = datetime.utcfromtimestamp(timestamp['_seconds'])

    # Halifax is UTC -4
    halifax_offset = timedelta(hours=-4)
    date_time_halifax = date_time_utc + halifax_offset

    # Format the datetime object to a readable string format
    readable_format = date_time_halifax.strftime("%d %B %Y, %H:%M")
    return readable_format


def send_direct_email_notification(email, message, recipient_type):
    if recipient_type == "customer":
        sns_topic_arn = customer_sns_topic_arn
        subject = "Customer Reservation Modified"
    elif recipient_type == "restaurant":
        sns_topic_arn = restaurant_sns_topic_arn
        subject = "Restaurant Reservation Update"
    else:
        raise ValueError("Invalid recipient type")

    message_attributes = {
        'email': {
            'DataType': 'String',
            'StringValue': email
        }
    }
    sns.publish(
        TopicArn=sns_topic_arn,
        Message=message,
        Subject=subject,
        MessageAttributes=message_attributes
    )

def ensure_subscription(email, recipient_type):
    if recipient_type == "customer":
        sns_topic_arn = customer_sns_topic_arn
    elif recipient_type == "restaurant":
        sns_topic_arn = restaurant_sns_topic_arn
    else:
        raise ValueError("Invalid recipient type")

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
        details += f"👥 Guests: {reservation.get('no_of_people', 'Not specified')}\n"
        details += f"🏠 Restaurant: {reservation.get('restaurant_name', 'Not specified')}\n"
        if 'selectedMenuItems' in reservation:
            menu_items = ", ".join([f"{item['name']} (qty: {item['quantity']})" for item in reservation['selectedMenuItems']])
            details += f"🍽️ Selected Menu Items: {menu_items}\n"
    details += message_details
    greeting = "Hi there! "
    emoji = "❌" if action == "cancelled" else "✏️"
    return f"{greeting}{emoji} {details}"



