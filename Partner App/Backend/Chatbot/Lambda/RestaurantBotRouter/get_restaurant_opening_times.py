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
    prompts = Prompts('get_opening_times')
    responses = Responses('get_opening_times')
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    
    if restaurant_name:
        dialog.set_session_attribute(intent_request, 'restaurant_name', restaurant_name)
        session_attributes = dialog.get_session_attributes(intent_request)
        
    restaurant_name_from_session = dialog.get_session_attribute(intent_request, 'restaurant_name')
    if restaurant_name_from_session:
        dialog.set_slot('RestaurantName', restaurant_name_from_session, intent)
        restaurant_name = restaurant_name_from_session
        
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_name(restaurant_name, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        else:
            restaurant_opening_times = restaurant_system.get_restaurant_opening_times(restaurant_name, client)
            response = responses.get('Fulfilment', get_restaurant_opening_times=restaurant_opening_times)
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
