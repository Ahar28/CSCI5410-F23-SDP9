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
    prompts = Prompts('get_available_reservation')
    responses = Responses('get_available_reservation')
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    reservation_date = dialog.get_slot('ReservationDate', intent)
    
    if restaurant_name:
        dialog.set_session_attribute(intent_request, 'restaurant_name', restaurant_name)
        session_attributes = dialog.get_session_attributes(intent_request)
        
    restaurant_name_from_session = dialog.get_session_attribute(intent_request, 'restaurant_name')
    if restaurant_name_from_session:
        dialog.set_slot('RestaurantName', restaurant_name_from_session, intent)
        restaurant_name = restaurant_name_from_session
    
    if restaurant_name and not reservation_date:
        previous_slot_to_elicit = dialog.get_previous_slot_to_elicit(intent_request)
        if previous_slot_to_elicit !='ReservationDate':
            prompt = prompts.get('ReservationDate')
            return dialog.elicit_slot('ReservationDate', active_contexts, session_attributes, intent, [{'contentType': 'PlainText', 'content': prompt}])
            
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_name(restaurant_name, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        else:
            available_reservation = restaurant_system.get_restaurant_available_reservation_slots(restaurant_name, reservation_date, client)
            response = responses.get('Fulfilment', restaurant_name=restaurant_name, reservation_date=reservation_date, available_reservation=available_reservation)
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
