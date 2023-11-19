import json

def get_restaurant_owners(client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getAllRestaurantOwners'})
       )
    # print("Owner payload", json.load(apiResponse['Payload'])['values'])
    return json.load(apiResponse['Payload'])['values']
   
def get_list_of_restaurant_names(client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getAllRestaurantNames'})
       )

    return json.load(apiResponse['Payload'])['values']
    
def check_restaurant_owner(restaurant_name, owner_id, client):
    restaurant_owners = get_restaurant_owners(client)
    print(restaurant_owners, len(restaurant_owners))
    #User doesn't have a restaurant in the system
    if owner_id not in restaurant_owners:
        print("owner not found", owner_id)
        return False
        
    #Check if user owns restaurant
    for db_restaurant_name in restaurant_owners[owner_id]:
        print(db_restaurant_name, restaurant_name, db_restaurant_name.lower() == restaurant_name.lower())
        if db_restaurant_name.lower() == restaurant_name.lower():
            return True
            
    #User doesn't own the mentioned restaurant        
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
    
def get_restaurant_rating(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantRating', 'restaurant_name': restaurant_name})
        )

    return json.load(apiResponse['Payload'])['values']