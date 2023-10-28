import json
import boto3

client = boto3.client('lambda')

def lambda_handler(event, context):
    print("getRestaurantOpeningTimes event", event)
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getRestaurantDetailsWithName', 'restaurant_name': event['restaurant_name']})
        )
    restaurant_details = json.load(apiResponse['Payload'])['values']
    print(restaurant_details)

    timings = restaurant_details['timings']
    days_of_week = ['monday','tuesday', 'wednesday','thursday', 'friday','saturday', 'sunday']
    
    message = f'{event["restaurant_name"]} timings are:\n'
    for day in days_of_week:
        if day in timings:
            message += (f'{day}: {timings[day]["opening_time"]} - {timings[day]["closing_time"]}\n')
        else:
            message += (f'{day}: closed\n')
        
    return {
        'statusCode': 200,
        'message': message
    }