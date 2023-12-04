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
    prompts = Prompts('cancel_reservation')
    responses = Responses('cancel_reservation')
    
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    reservation_id = dialog.get_slot('ReservationId', intent, preference='originalValue')
    confirmation = dialog.get_slot('Confirm', intent)
    user_id, user_email = dialog.get_from(intent_request)
    
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_owner(restaurant_name, user_id, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )

        if reservation_id:
            does_reservation_match = restaurant_system.check_reservation(restaurant_name, reservation_id, client)
            if not does_reservation_match:
                prompt = prompts.get('InvalidReservationId', reservation_id=reservation_id)
                return dialog.elicit_slot(
                    'ReservationId', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
        
        if reservation_id and not confirmation:
            reservation_details = restaurant_system.get_reservation(restaurant_name, reservation_id, client)
            prompt = prompts.get('ConfirmReservationDetails', reservation_id=reservation_id, datetime=reservation_details['datetime'], no_of_people=reservation_details['data']['no_of_people'])
            return dialog.elicit_slot(
                'Confirm', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
            
        if reservation_id and confirmation:
            if confirmation != 'Yes':
                response = responses.get('FulfilmentCancelDeletion')
            else:
                deletion_successful = restaurant_system.cancel_reservation(reservation_id, client)
                if deletion_successful:
                    response = responses.get('FulfilmentSuccess', restaurant_name=restaurant_name, reservation_id=reservation_id)
                else:
                    response = responses.get('FulfilmentFailed', restaurant_name=restaurant_name, reservation_id=reservation_id)
                
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
