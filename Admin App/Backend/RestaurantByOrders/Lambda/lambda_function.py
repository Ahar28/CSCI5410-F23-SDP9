import json
import boto3
from access_key import checkAccess

client = boto3.client('lambda')

def lambda_handler(event, context):
    
    if not checkAccess(event):
        return {
            'statusCode': 401,
            'body': 'Unauthorized'
                
        }

    reservationAPIResponse = client.invoke(
            FunctionName = 'reservationAPIHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getAllReservations'})
        )
    reservations = json.load(reservationAPIResponse['Payload'])['body']['document']
    print(reservations)
    restaurantsAPIResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getAllRestuarantsWithBasicInformation'})
        )
    restaurants = json.load(restaurantsAPIResponse['Payload'])['values']
    
    restaurant_names = {restaurant['restaurant_id']:restaurant['restaurant_name'] for restaurant in restaurants}
    restaurant_order_count = {restaurant['restaurant_id']:0 for restaurant in restaurants}


    for reservation in reservations:
        restaurant_id = str(reservation['restaurant_id'])
        restaurant_order_count[restaurant_id] += 1
    
    restaurant_orders = [(restaurant_names[restaurant_id], restaurant_order_count[restaurant_id]) for restaurant_id in restaurant_names]
        
    return {
        'statusCode': 200,
        'body': json.dumps(restaurant_orders)
    }
