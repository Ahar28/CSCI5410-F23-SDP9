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
    prompts = Prompts('get_restaurant_menu_item_reviews')
    responses = Responses('get_restaurant_menu_item_reviews')
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    menu_item = dialog.get_slot('MenuItem', intent)
    user_id = dialog.get_from(intent_request)
    
    # #For testing purpose
    # user_id = "BGbFnGLjAGh4NP0PnSiv05sj8Hm1"
    # restaurant_name = "Mexican Restaurant"
    
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_owner(restaurant_name, user_id, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt', restaurant_name=restaurant_name)
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        
        if menu_item:
            does_menu_item_match = restaurant_system.check_restaurant_menu_item(restaurant_name, menu_item, client)
            
            if not does_menu_item_match:
                prompt = prompts.get('InvalidMenuItemPrompt', menu_item=menu_item, restaurant_name=restaurant_name)
                return dialog.elicit_slot(
                    'MenuItem', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
                    
            restaurant_menu_item_reviews = restaurant_system.get_restaurant_menu_item_reviews(restaurant_name, menu_item, client)
            # print("menu_item reviews",menu_item,restaurant_menu_item_reviews)
            if not restaurant_menu_item_reviews:
                response = responses.get('FulfilmentNoReviews', menu_item=menu_item)
            else:
                review_message = ''
                for i in range(len(restaurant_menu_item_reviews)):
                    review_message += f'{i+1}) {restaurant_menu_item_reviews[i]}\n'
                response = responses.get('Fulfilment', menu_item=menu_item, menu_item_reviews=review_message)
                
            return dialog.elicit_intent(active_contexts, 
                        session_attributes, intent, 
                        [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
