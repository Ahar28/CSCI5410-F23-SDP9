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
    prompts = Prompts('provide_menu_item_review_rating')
    responses = Responses('provide_menu_item_review_rating')
    
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    menu_item = dialog.get_slot('MenuItem', intent)
    review = dialog.get_slot('Review', intent)
    rating = dialog.get_slot('Rating', intent)
    user_id, user_email = dialog.get_from(intent_request)

    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_name(restaurant_name, client)

        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )

        if menu_item:
            does_menu_item_match = restaurant_system.check_menu_item_name(restaurant_name, menu_item, client)
            if not does_menu_item_match:
                prompt = prompts.get('InvalidMenuItemPrompt', restaurant_name=restaurant_name, menu_item=menu_item)
                return dialog.elicit_slot(
                    'MenuItem', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
                
            if rating:
                if '.' in rating:
                    print("Error: Rating is float", rating)
                    prompt = prompts.get('RatingNotInt',rating=rating)
                    return dialog.elicit_slot(
                    'Rating', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
                rating = int(rating)
                if rating < 1 or rating > 5:
                    print("Error: rating out of range", rating)
                    prompt = prompts.get('RatingOutOfRange', rating=rating)
                    return dialog.elicit_slot(
                    'Rating', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
    
            if review and rating:
                review_publish_successfully = restaurant_system.provide_menu_item_review_rating(restaurant_name, menu_item, review, rating, user_id, client)
                if review_publish_successfully:
                    response = responses.get('FulfilmentSuccess', restaurant_name=restaurant_name, menu_item=menu_item, review=review, rating=rating)
                else:
                    response = responses.get('FulfilmentFailed', restaurant_name=restaurant_name, menu_item=menu_item, review=review, rating=rating)
                    
                return dialog.elicit_intent(active_contexts, 
                                session_attributes, intent, 
                                [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
