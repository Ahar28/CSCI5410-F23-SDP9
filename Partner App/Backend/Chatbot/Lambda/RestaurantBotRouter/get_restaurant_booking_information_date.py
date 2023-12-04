import dialogstate_utils as dialog
from prompts_responses import Prompts, Responses
from datetime import date, timedelta, datetime
import json
import random as random
import restaurant_system

def handler(intent_request, client):
    intent = dialog.get_intent(intent_request)
    active_contexts = dialog.get_active_contexts(intent_request)
    session_attributes = dialog.get_session_attributes(intent_request)
    prompts = Prompts('get_restaurant_booking_by_date')
    responses = Responses('get_restaurant_booking_by_date')
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    date = dialog.get_slot('BookingDate', intent)
    user_id, user_email = dialog.get_from(intent_request)

    print(date)
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_owner(restaurant_name, user_id, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt', restaurant_name=restaurant_name)
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        
        if date:
            restaurant_bookings = restaurant_system.get_restaurant_booking_by_date(restaurant_name, date, client)
            # print("menu_item reviews",menu_item,restaurant_menu_item_reviews)
            print("got bookings ", restaurant_bookings)
            if not restaurant_bookings:
                response = responses.get('FulfilmentNoBookings', date=date)
            else:
                bookings_message = ''
                for i in range(len(restaurant_bookings)):
                    print("Booking ", restaurant_bookings[i])
                    bookings_message += f'{i+1}) time: {restaurant_bookings[i]["datetime"]} capacity: {restaurant_bookings[i]["data"]["no_of_people"]} reservation id: {restaurant_bookings[i]["id"]}\n'
                response = responses.get('Fulfilment', bookings=bookings_message, date=date)
                
            return dialog.elicit_intent(active_contexts, 
                        session_attributes, intent, 
                        [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
