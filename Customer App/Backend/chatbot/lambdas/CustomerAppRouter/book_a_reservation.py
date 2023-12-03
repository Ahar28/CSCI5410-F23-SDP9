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
    prompts = Prompts('book_a_reservation')
    responses = Responses('book_a_reservation')
    
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    booking_date = dialog.get_slot('BookingDate', intent)
    booking_time = dialog.get_slot('BookingTime', intent)
    capacity = dialog.get_slot('Capacity', intent)
    user_id = dialog.get_from(intent_request)
    
    #user_id="8cWoLpnUBZOBBrnNP6jZhhPVJoj2"
    
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_name(restaurant_name, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                
        if booking_date:
            try:
                booking_datetime = datetime.strptime(booking_date, "%Y-%m-%d")
            except:
                prompt = prompts.get('InvalidDate')
                return dialog.elicit_slot(
                'BookingDate', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                
        if booking_time:
            if isinstance(booking_time, list):
                print("Ambiguous booking time", booking_time)
                prompt = prompts.get('InvalidTimeAmbiguous')
                return dialog.elicit_slot(
                'BookingTime', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                
            try:
                print("Booking time check", booking_time)
                booking_time_datetime = datetime.strptime(booking_time, "%H:%M")
                print("Found bookind datetime:", booking_datetime)
            except:
                prompt = prompts.get('InvalidTime')
                return dialog.elicit_slot(
                'BookingTime', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )

        if booking_date and booking_time and (capacity != None):
            reservation_message = restaurant_system.book_a_reservation(restaurant_name, booking_date, booking_time, capacity, client, user_id)
            if reservation_message == 'Reservation made successfully':
                response = responses.get('FulfilmentSuccess', restaurant_name=restaurant_name, date=booking_date, time=booking_time, capacity=capacity)
            else:
                response = responses.get('FulfilmentFailed', restaurant_name=restaurant_name, date=booking_date, time=booking_time, capacity=capacity, reservation_message=reservation_message)
                
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
