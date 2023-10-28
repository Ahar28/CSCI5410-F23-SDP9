import json
import boto3
from datetime import datetime
import time

client = boto3.client('lambda')

def lambda_handler(event, context):
    # TODO implement
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getRestaurantDetailsWithName', 'restaurant_name': event['restaurant_name']})
        )
    restaurant_details = json.load(apiResponse['Payload'])['values']
    print(restaurant_details)
    
    
    date_obj = datetime.strptime(event['reservation_date'], '%Y-%m-%d')
    date_timestamp = time.mktime(date_obj.timetuple())
    reservation_day = date_obj.strftime("%A").lower()
    print(reservation_day)
    
    
    reservation_day_opening_time = restaurant_details['timings'][reservation_day]['opening_time']
    
    #Check if restaurant is closed on that weekday
    if not reservation_day_opening_time:
        return {
            'statusCode': 200,
            'message': json.dumps('No available reservation slots')
        }
        
    #Get reservations from google cloud
    apiResponse = client.invoke(
            FunctionName = 'reservationAPIHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getReservationsByRestaurant', 'restaurant_id': restaurant_details['restaurant_id']})
        )
        
    available_reservation_slots = []
    reservations = json.load(apiResponse['Payload'])['body']['document']
    print(reservations)
    reservations_on_date = []
    for reservation in reservations:
        if reservation['reservation_date']['_seconds'] >= date_timestamp and reservation['reservation_date']['_seconds'] <= date_timestamp + 86400:
            reservations_on_date.append(reservation)
    print(reservations_on_date)
    
    
    
    return {
        'statusCode': 200,
        'message': json.dumps('available_reservation_slots')
    }