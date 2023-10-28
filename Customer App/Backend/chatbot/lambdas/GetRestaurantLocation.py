import json
import boto3

client = boto3.client('lambda')

def lambda_handler(event, context):
    # print("getRestaurantOpeningTimes event", event)
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getRestaurantDetailsWithName', 'restaurant_name': event['restaurant_name']})
        )
    restaurant_details = json.load(apiResponse['Payload'])['values']
    # print(restaurant_details)

    location = restaurant_details['address']
    message = f'{event["restaurant_name"]}: {location}'
        
    return {
        'statusCode': 200,
        'message': message
    }