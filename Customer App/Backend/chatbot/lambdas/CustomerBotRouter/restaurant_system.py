import json

def get_list_of_restaurant_names(client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getAllRestaurantNames'})
       )

    return json.load(apiResponse['Payload'])['values']
    
def check_restaurant_name(restaurant_name, client):
    restaurants = get_list_of_restaurant_names(client)
    
    for restaurant in restaurants:
        if restaurant_name.lower() == restaurant.lower():
            return True
    return False

def get_restaurant_opening_times(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'GetRestaurantOpeningTimes',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'restaurant_name': restaurant_name})
        )

    timings = json.load(apiResponse['Payload'])['message']
    return timings
    
def get_restaurant_location(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'GetRestaurantLocation',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'restaurant_name': restaurant_name})
        )

    location = json.load(apiResponse['Payload'])['message']
    return location
    
def get_restaurant_available_menu(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'GetRestaurantAvailableMenu',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'restaurant_name': restaurant_name})
        )

    menu = json.load(apiResponse['Payload'])['message']
    return menu
    
def get_restaurant_available_reservation_slots(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'GetReservationAvailability',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'restaurant_name': restaurant_name})
        )

    available_reservation = json.load(apiResponse['Payload'])['message']
    return available_reservation