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

def get_restaurant_reviews(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantReviews', 'restaurant_name': restaurant_name})
        )

    return json.load(apiResponse['Payload'])['values']

def get_restaurant_menu_items(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantMenuItems', 'restaurant_name': restaurant_name})
        )

    return json.load(apiResponse['Payload'])['values']
    
def check_restaurant_menu_item(restaurant_name, menu_item, client):
    menu_items = get_restaurant_menu_items(restaurant_name, client)
    print(menu_items, len(menu_items))
    
    for item in menu_items:
        if item['name'].lower() == menu_item.lower():
            return True
            
    return False
    
    
def get_restaurant_menu_item_reviews(restaurant_name, menu_item, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantMenuItemReviews', 'restaurant_name': restaurant_name, 'menu_item': menu_item})
        )

    return json.load(apiResponse['Payload'])['values']

def get_restaurant_booking_by_date(restaurant_name, date, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantReservationsBookingByDate', 'restaurant_name': restaurant_name, 'date': date})
        )

    return json.load(apiResponse['Payload'])['values']
    
def get_restaurant_booking_by_week(restaurant_name, date, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantReservationsBookingByWeek', 'restaurant_name': restaurant_name, 'date': date})
        )

    return json.load(apiResponse['Payload'])['values']

def get_restaurant_booking_by_month(restaurant_name, date, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantReservationsBookingByMonth', 'restaurant_name': restaurant_name, 'date': date})
        )

    return json.load(apiResponse['Payload'])['values']

def update_restaurant_timings(restaurant_name, opening_time, closing_time, user_id, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({
                'function': 'updateTimings',
                'restaurant_name': restaurant_name,
                'opening_time': opening_time,
                'closing_time': closing_time,
                'user_id': user_id,
            })
        )

    return json.load(apiResponse['Payload'])['values']
    
def update_restaurant_location(restaurant_name, location, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({
                'function': 'updateLocation',
                'restaurant_name': restaurant_name,
                'location': location
            })
        )

    return json.load(apiResponse['Payload'])['values']
    
def get_restaurant_reservations(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'getRestaurantReservations', 'restaurant_name': restaurant_name})
        )

    return json.load(apiResponse['Payload'])['values']


def check_reservation(restaurant_name, reservation_id, client):
    reservations = get_restaurant_reservations(restaurant_name, client)
    print(reservation_id, reservations, len(reservations))
    
    for reservation in reservations:
        if reservation['id'] == reservation_id:
            print("Found reservation", reservation_id)
            return True
            
    return False

def get_reservation(restaurant_name, reservation_id, client):
    reservations = get_restaurant_reservations(restaurant_name, client)
    print(reservations, len(reservations))
    
    for reservation in reservations:
        if reservation['id'] == reservation_id:
            return reservation
            
    return None

def cancel_reservation(reservation_id, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'deleteReservation', 'reservation_id': reservation_id})
        )

    return json.load(apiResponse['Payload'])['values']

def edit_reservation(restaurant_name, reservation_id, booking_date, booking_time, capacity, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function': 'editReservation',
            'restaurant_name': restaurant_name,
            'reservation_id': reservation_id,
            'booking_date': booking_date,
            'booking_time': booking_time,
            'capacity': capacity,
            })
        )

    return json.load(apiResponse['Payload'])['values']