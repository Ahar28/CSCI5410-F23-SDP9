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
    prompts = Prompts('update_restaurant_location')
    responses = Responses('update_restaurant_location')
    
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    location = dialog.get_slot('Location', intent)

    user_id,user_email = dialog.get_from(intent_request)
    
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_owner(restaurant_name, user_id, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                    
        if location:
            update_successful = restaurant_system.update_restaurant_location(restaurant_name, location, client)
            if update_successful:
                response = responses.get('FulfilmentSuccess', restaurant_name=restaurant_name, location=location)
            else:
                response = responses.get('FulfilmentFailed', restaurant_name=restaurant_name, location=location)
                
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
