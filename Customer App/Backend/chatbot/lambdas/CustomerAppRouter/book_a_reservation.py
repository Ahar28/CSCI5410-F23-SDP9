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
    prompts = Prompts('book_a_reservation')
    responses = Responses('book_a_reservation')
    
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    booking_date = dialog.get_slot('BookingDate', intent)
    booking_time = dialog.get_slot('BookingTime', intent)
    capacity = dialog.get_slot('Capacity', intent)
    add_menu_items = dialog.get_slot('AddMenuItems', intent)
    menu_item = dialog.get_slot('MenuItem', intent)
    menu_item_quantity = dialog.get_slot('MenuItemQuantity', intent)
    
    menu_items_in_order = dialog.get_session_attribute(intent_request, 'menu_items_in_order')
    if not menu_items_in_order:
        menu_items_in_order = {}
        dialog.set_session_attribute(intent_request, 'menu_items_in_order', json.dumps(menu_items_in_order))
    else:
        menu_items_in_order = json.loads(menu_items_in_order)
        
    user_id, user_email = dialog.get_from(intent_request)

    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_name(restaurant_name, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
            
        if booking_date:
            try:
                booking_datetime = datetime.strptime(booking_date, "%Y-%m-%d")
            except:
                prompt = prompts.get('InvalidDate')
                return dialog.elicit_slot(
                'BookingDate', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                

        
        if booking_time:
            if isinstance(booking_time, list):
                print("Ambiguous booking time", booking_time)
                prompt = prompts.get('InvalidTimeAmbiguous')
                return dialog.elicit_slot(
                'BookingTime', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                
            try:
                print("Booking time check", booking_time)
                booking_time_datetime = datetime.strptime(booking_time, "%H:%M")
                print("Found bookind datetime:", booking_datetime)
            except:
                prompt = prompts.get('InvalidTime')
                return dialog.elicit_slot(
                'BookingTime', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        

        if booking_date and booking_time and (capacity != None) and add_menu_items and add_menu_items == 'Yes':
            ask_next_menu_item_to_add = dialog.get_session_attribute(intent_request, 'ask_next_menu_item_to_add')
            if ask_next_menu_item_to_add and ask_next_menu_item_to_add=='Yes':
                print("Asking again")
                dialog.set_session_attribute(intent_request, 'ask_menu_item', 'Yes')
                dialog.set_session_attribute(intent_request, 'ask_menu_item_quantity', 'Yes')
                dialog.set_session_attribute(intent_request, 'ask_next_menu_item_to_add', 'no')
            
            ask_menu_item = dialog.get_session_attribute(intent_request, 'ask_menu_item')
            print("Checking menu items", ask_menu_item, menu_item)
            if not menu_item or ask_menu_item == 'Yes':
                ask_menu_item = 'no'
                dialog.set_session_attribute(intent_request, 'ask_menu_item', ask_menu_item)
                
                prompt = prompts.get('GetMenuItem')
                return dialog.elicit_slot(
                'MenuItem', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                
            
            
            does_menu_item_match = restaurant_system.check_menu_item_name(restaurant_name, menu_item, client)
            if not does_menu_item_match:
                prompt = prompts.get('InvalidMenuItem', restaurant_name=restaurant_name, menu_item=menu_item)
                return dialog.elicit_slot(
                    'MenuItem', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
            
            ask_menu_item_quantity = dialog.get_session_attribute(intent_request, 'ask_menu_item_quantity')
            if not menu_item_quantity or ask_menu_item_quantity == 'Yes':
                ask_menu_item_quantity = 'no'
                dialog.set_session_attribute(intent_request, 'ask_menu_item_quantity', ask_menu_item_quantity)
                
                prompt = prompts.get('GetMenuItemQuantity', menu_item=menu_item)
                return dialog.elicit_slot(
                'MenuItemQuantity', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
            
            if '.' in menu_item_quantity:
                print("Error: Quantity is float", menu_item_quantity)
                prompt = prompts.get('QuantityNotInt',quantity=menu_item_quantity)
                return dialog.elicit_slot(
                'MenuItemQuantity', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
            menu_item_quantity = int(menu_item_quantity)
            if menu_item_quantity < 1:
                print("Error: quantity out of range", menu_item_quantity)
                prompt = prompts.get('QuantityOutOfRange', quantity=menu_item_quantity)
                return dialog.elicit_slot(
                'MenuItemQuantity', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
                    
            
            menu_item_key = restaurant_system.get_menu_item_key(restaurant_name, menu_item, client)
            menu_items_in_order[menu_item_key] = menu_item_quantity
            dialog.set_session_attribute(intent_request, 'menu_items_in_order', json.dumps(menu_items_in_order))
            
            dialog.set_session_attribute(intent_request, 'ask_next_menu_item_to_add', 'Yes')
            prompt = prompts.get('AddAnotherMenuItem')
            return dialog.elicit_slot(
                'AddMenuItems', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        
        print("Order:",menu_items_in_order)
        if booking_date and booking_time and (capacity != None) and add_menu_items:
            selected_menu_items = [{'name': menu_item_key, 'quantity':menu_items_in_order[menu_item_key]} for menu_item_key in menu_items_in_order]
            reservation_message = restaurant_system.book_a_reservation(restaurant_name, booking_date, booking_time, capacity, client, user_id, user_email, selected_menu_items)
            if 'Reservation made successfully' in reservation_message:
                if not menu_items_in_order:
                    response = responses.get('FulfilmentSuccess', restaurant_name=restaurant_name, date=booking_date, time=booking_time, capacity=capacity)
                else:
                    menu_items_message = ''
                    for menu_item in menu_items_in_order:
                        menu_items_message += f'{menu_items_in_order[menu_item]} {menu_item},'
                    menu_items_message = menu_items_message[:-1]
                    response = responses.get('FulfilmentSuccessWithMenuItems', restaurant_name=restaurant_name, date=booking_date, time=booking_time, capacity=capacity, menu_items=menu_items_message)
            else:
                response = responses.get('FulfilmentFailed', restaurant_name=restaurant_name, date=booking_date, time=booking_time, capacity=capacity, reservation_message=reservation_message)
                
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
 
    return dialog.delegate(active_contexts, session_attributes, intent)                    
