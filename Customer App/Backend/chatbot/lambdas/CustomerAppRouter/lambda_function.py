"""
 This code sample demonstrates an implementation of the Lex Code Hook Interface
 in order to serve a bot which manages banking account services. Bot, Intent, 
 and Slot models which are compatible with this sample can be found in the Lex 
 Console as part of the 'AccountServices' template.
"""
import json
import time
import os
import logging
import dialogstate_utils as dialog
import fallback
# import repeat

import get_restaurants
import get_restaurant_opening_times
import get_restaurant_location
import get_restaurant_available_menu
import get_restaurant_available_reservation
import book_a_reservation
import provide_restaurant_review_rating
import provide_menu_item_review_rating

import boto3

client = boto3.client('lambda')

logger = logging.getLogger()
# logger.setLevel(logging.DEBUG)
    
# --- Main handler & Dispatch ---

def dispatch(intent_request):
    """
    Route to the respective intent module code
    """
    print(intent_request)
    intent = dialog.get_intent(intent_request)
    intent_name = intent['name']
    active_contexts = dialog.get_active_contexts(intent_request)
    session_attributes = dialog.get_session_attributes(intent_request)
    
    customer_id = dialog.get_session_attribute(intent_request, 'customer_id')
    
    if customer_id and customer_id[0] == '.':
        dialog.set_session_attribute(
            intent_request, 'customer_id', customer_id[1:])
        

    
    # Default dialog state is set to delegate
    next_state = dialog.delegate(active_contexts, session_attributes, intent)
    
    # Dispatch to in-built Lex intents
    if intent_name == 'FallbackIntent':
        next_state = fallback.handler(intent_request)
    elif intent_name == 'GetRestaurants':
        next_state = get_restaurants.handler(intent_request, client)
    elif intent_name == 'GetRestaurantOpeningTime':
        next_state = get_restaurant_opening_times.handler(intent_request, client)
    elif intent_name == 'GetRestaurantLocation':
        next_state = get_restaurant_location.handler(intent_request, client)
    elif intent_name == 'GetAvailableMenuItems':
        next_state = get_restaurant_available_menu.handler(intent_request, client)
    elif intent_name == 'GetReservationAvailability':
        next_state = get_restaurant_available_reservation.handler(intent_request, client)
    elif intent_name == 'BookAReservation':
        next_state = book_a_reservation.handler(intent_request, client)
    elif intent_name == 'ProvideRestaurantReview':
        next_state = provide_restaurant_review_rating.handler(intent_request, client)
    elif intent_name == 'ProvideMenuItemReview':
        next_state = provide_menu_item_review_rating.handler(intent_request, client)
    return next_state


def lambda_handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    # By default, treat the user request as coming from the America/New_York time zone.
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug(event)

    return dispatch(event)
