import boto3
import json

# Initialize the SNS client
sns = boto3.client('sns')

def lambda_handler(event, context):
    email = event['email']
    message = event['message']
    sns_topic_arn = event['sns_topic_arn']

    sns.publish(
        TopicArn=sns_topic_arn,
        Message=message,
        Subject="Scheduled Reservation Notification",
        MessageAttributes={'email': {'DataType': 'String', 'StringValue': email}}
    )
