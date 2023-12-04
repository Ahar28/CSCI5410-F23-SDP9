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
    prompts = Prompts('update_restaurant_timings')
    responses = Responses('update_restaurant_timings')
    
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    opening_time = dialog.get_slot('OpeningTime', intent)
    closing_time = dialog.get_slot('ClosingTime', intent)

    user_id, user_email = dialog.get_from(intent_request)
    
    
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_owner(restaurant_name, user_id, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )

        if opening_time:
            if isinstance(opening_time, list):
                print("Ambiguous opening time", opening_time)
                prompt = prompts.get('InvalidTimeAmbiguous')
                return dialog.elicit_slot(
                    'OpeningTime', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
                
            try:
                print("OpeningTime check", opening_time)
                opening_time_datetime = datetime.strptime(opening_time, "%H:%M")
                print("Found bookind OpeningTime:", opening_time_datetime)
            except:
                prompt = prompts.get('InvalidTime')
                return dialog.elicit_slot(
                    'OpeningTime', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
                    
        if closing_time:
            if isinstance(closing_time, list):
                print("Ambiguous ClosingTime", closing_time)
                prompt = prompts.get('InvalidTimeAmbiguous')
                return dialog.elicit_slot(
                    'ClosingTime', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
                
            try:
                print("ClosingTime check", closing_time)
                closing_time_datetime = datetime.strptime(closing_time, "%H:%M")
                print("Found bookind ClosingTime:", closing_time_datetime)
            except:
                prompt = prompts.get('InvalidTime')
                return dialog.elicit_slot(
                    'ClosingTime', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
                    
        if opening_time and closing_time:
            update_successful = restaurant_system.update_restaurant_timings(restaurant_name, opening_time, closing_time, user_id, client)
            if update_successful:
                response = responses.get('FulfilmentSuccess', restaurant_name=restaurant_name, opening_time=opening_time, closing_time=closing_time)
            else:
                response = responses.get('FulfilmentFailed', restaurant_name=restaurant_name, opening_time=opening_time, closing_time=closing_time)
                
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
