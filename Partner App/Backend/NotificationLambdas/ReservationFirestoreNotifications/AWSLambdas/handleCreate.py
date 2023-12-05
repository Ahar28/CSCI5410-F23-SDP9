import json
import boto3
from datetime import datetime, timedelta

sns = boto3.client('sns')
eventbridge = boto3.client('events')
customer_sns_topic_arn = 'arn:aws:sns:us-east-1:944271984411:CustomerNotifications'
restaurant_sns_topic_arn = 'arn:aws:sns:us-east-1:944271984411:RestaurantNotifications'

def lambda_handler(event, context):
    new_reservation = event.get('newReservation')
    user_email = event.get('userEmail')
    restaurant_email = event.get('restaurantEmail')

    if user_email:
        customer_message = create_customer_message(new_reservation)
        ensure_subscription(user_email, "customer")
        send_direct_email_notification(user_email, customer_message, "customer")
        schedule_customer_notification(new_reservation, user_email, "customer")

    if restaurant_email:
        restaurant_message = create_restaurant_message(new_reservation)
        ensure_subscription(restaurant_email, "restaurant")
        send_direct_email_notification(restaurant_email, restaurant_message, "restaurant")
        schedule_restaurant_notification(new_reservation, restaurant_email, "restaurant")

    return {'statusCode': 200, 'body': json.dumps('Notifications scheduled successfully.')}

def create_customer_message(reservation):
    return (f"🎉 Your reservation for {reservation['no_of_people']} on "
            f"{format_timestamp(reservation['reservation_date'])} is confirmed. "
            "🕒 You will also receive a reminder 30 minutes before your reservation time.")

def schedule_customer_notification(reservation, email, recipient_type):
    notification_time = datetime.utcfromtimestamp(reservation['reservation_date']['_seconds']) - timedelta(minutes=30)
    reminder_message = "⏰ Reminder: Your reservation is in 30 minutes!"
    # Schedule the reminder using AWS EventBridge
    schedule_event(notification_time, email, reminder_message, recipient_type)

def create_restaurant_message(reservation):
    message = (f"🍽️ New reservation for {reservation['no_of_people']} on "
               f"{format_timestamp(reservation['reservation_date'])}. ")
    if 'selectedMenuItems' in reservation and reservation['selectedMenuItems']:
        message += "⏱️ You will also receive a reminder 1 hour before the reservation time."
    else:
        message += "⏱️ You will also receive a reminder 10 minutes before the reservation time."
    return message

def schedule_restaurant_notification(reservation, email, recipient_type):
    if 'selectedMenuItems' in reservation and reservation['selectedMenuItems']:
        notification_time = datetime.utcfromtimestamp(reservation['reservation_date']['_seconds']) - timedelta(hours=1)
    else:
        notification_time = datetime.utcfromtimestamp(reservation['reservation_date']['_seconds']) - timedelta(minutes=10)
    reminder_message = "⏰ Reminder: Reservation coming up!"
    # Schedule the reminder using AWS EventBridge
    schedule_event(notification_time, email, reminder_message, recipient_type)

def schedule_event(notification_time, email, message, recipient_type):
    
    sns_topic_arn = get_sns_topic_arn(recipient_type)

    # Convert notification time to a cron expression
    cron_expression = datetime_to_cron(notification_time)

    # Create EventBridge rule
    rule_name = f"send-sns-message-{notification_time.strftime('%Y%m%d%H%M%S')}"
    eventbridge.put_rule(
        Name=rule_name,
        ScheduleExpression=cron_expression,
        State='ENABLED'
    )

    # Define the target Lambda function
    target_lambda_arn = 'arn:aws:lambda:us-east-1:944271984411:function:publishLambda'
    eventbridge.put_targets(
        Rule=rule_name,
        Targets=[
            {
                'Id': f"target-{rule_name}",
                'Arn': target_lambda_arn,
                'Input': json.dumps({
                    'email': email,
                    'message': message,
                    'sns_topic_arn': sns_topic_arn
                })
            }
        ]
    )

def datetime_to_cron(dt):
    """Converts a datetime object to a cron expression for EventBridge"""
    return f"cron({dt.minute} {dt.hour} {dt.day} {dt.month} ? {dt.year})"


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
    sns_topic_arn = customer_sns_topic_arn if recipient_type == "customer" else restaurant_sns_topic_arn
    subject = "🔔 Customer Reservation Notification" if recipient_type == "customer" else "🔔 Restaurant Reservation Notification"
    sns.publish(
        TopicArn=sns_topic_arn,
        Message=message,
        Subject=subject,
        MessageAttributes={'email': {'DataType': 'String', 'StringValue': email}}
    )

def ensure_subscription(email, recipient_type):
    sns_topic_arn = customer_sns_topic_arn if recipient_type == "customer" else restaurant_sns_topic_arn
    subscriptions = sns.list_subscriptions_by_topic(TopicArn=sns_topic_arn)
    if not any(sub['Endpoint'] == email for sub in subscriptions['Subscriptions']):
        sns.subscribe(
            TopicArn=sns_topic_arn,
            Protocol='email',
            Endpoint=email,
            Attributes={'FilterPolicy': json.dumps({"email": [email]})}
        )

def get_sns_topic_arn(recipient_type):
    if recipient_type == "customer":
        return customer_sns_topic_arn
    elif recipient_type == "restaurant":
        return restaurant_sns_topic_arn
    else:
        raise ValueError("Invalid recipient type")
