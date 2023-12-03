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
    

def book_a_reservation(restaurant_name, booking_date, booking_time, capacity, client, user_id):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({
                'function': 'bookAReservation',
                'restaurant_name': restaurant_name,
                'booking_date': booking_date,
                'booking_time': booking_time,
                'capacity': capacity,
                'user_id': user_id})
        )

    return json.load(apiResponse['Payload'])['values']

def provide_restaurant_review_rating(restaurant_name, review, rating, user_id, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({
                'function': 'provideRestaurantReviewRating',
                'restaurant_name': restaurant_name,
                'review': review,
                'rating': rating,
                'user_id': user_id
            })
        )

    return json.load(apiResponse['Payload'])['values']

def provide_menu_item_review_rating(restaurant_name, menu_item, review, rating, user_id, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({
                'function': 'provideMenuItemReviewRating',
                'restaurant_name': restaurant_name,
                'menu_item': menu_item,
                'review': review,
                'rating': rating,
                'user_id': user_id
            })
        )

    return json.load(apiResponse['Payload'])['values']

def get_list_of_menu_items(restaurant_name, client):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({
                'function':'getMenuItemNames',
                'restaurant_name': restaurant_name
            })
       )
    return json.load(apiResponse['Payload'])['values']
    
def check_menu_item_name(restaurant_name, menu_item_request, client):
    menu_items = get_list_of_menu_items(restaurant_name, client)
    
    for menu_item in menu_items:
        if menu_item.lower() == menu_item_request.lower():
            return True
    return False