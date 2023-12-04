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
    user_id, user_email = dialog.get_from(intent_request)
    
    restaurants = restaurant_system.get_list_of_restaurant_names(client)
    if (restaurants):
        restaurants=','.join(restaurants)
        responses = Responses('get_restaurants')
        response = responses.get('FulfilmentPrompt', restaurants=restaurants)
        
        return dialog.elicit_intent(active_contexts, 
                        session_attributes, intent, 
                        [{'contentType': 'PlainText', 'content': response}],
                    )
    
    return dialog.delegate(active_contexts, session_attributes, intent)                    
