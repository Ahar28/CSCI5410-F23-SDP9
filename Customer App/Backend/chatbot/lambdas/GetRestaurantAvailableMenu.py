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

    menu = restaurant_details['menu']
    message = ''
    
    for menu_item in menu:
        if menu_item['is_available']:
            average_rating = round(menu_item['menu_review_overall']['total_ratingvalue'] / menu_item['menu_review_overall']['total_numberratings'], 1)
            message += f"{menu_item['name']}, {menu_item['price']} CAD, {average_rating}/5.0 stars\n"
    return {
        'statusCode': 200,
        'message': message
    }