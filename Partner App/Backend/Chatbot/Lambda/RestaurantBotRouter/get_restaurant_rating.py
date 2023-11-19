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
    prompts = Prompts('get_restaurant_rating')
    responses = Responses('get_restaurant_rating')
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    user_id = dialog.get_from(intent_request)
    
        
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_owner(restaurant_name, user_id, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        else:
            restaurant_rating = restaurant_system.get_restaurant_rating(restaurant_name, client)
            response = responses.get('Fulfilment', restaurant_name=restaurant_name, restaurant_rating=restaurant_rating)
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
