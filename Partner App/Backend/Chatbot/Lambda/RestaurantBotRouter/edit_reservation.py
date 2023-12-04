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
    prompts = Prompts('edit_reservation')
    responses = Responses('edit_reservation')
    
    restaurant_name = dialog.get_slot('RestaurantName', intent)
    reservation_id = dialog.get_slot('ReservationId', intent, preference='originalValue')
    capacity = dialog.get_slot('Capacity', intent)
    confirmation = dialog.get_slot('Confirm', intent)
    booking_date = dialog.get_slot('Date', intent)
    booking_time = dialog.get_slot('Time', intent)
    
    user_id, user_email = dialog.get_from(intent_request)
    
    if restaurant_name and not intent['state'] == 'Fulfilled':
        does_restaurant_match = restaurant_system.check_restaurant_owner(restaurant_name, user_id, client)
        
        if not does_restaurant_match:
            prompt = prompts.get('InvalidRestaurantNamePrompt')
            return dialog.elicit_slot(
                'RestaurantName', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        print("Checking reservation_id", reservation_id)
        if reservation_id:
            does_reservation_match = restaurant_system.check_reservation(restaurant_name, reservation_id, client)
            if not does_reservation_match:
                prompt = prompts.get('InvalidReservationId', reservation_id=reservation_id)
                return dialog.elicit_slot(
                    'ReservationId', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
        print("Checking reservation_id confirmation", reservation_id,confirmation)
        if reservation_id and not confirmation:
            reservation_details = restaurant_system.get_reservation(restaurant_name, reservation_id, client)
            prompt = prompts.get('ConfirmReservationDetails', reservation_id=reservation_id, datetime=reservation_details['datetime'], no_of_people=reservation_details['data']['no_of_people'])
            return dialog.elicit_slot(
                'Confirm', active_contexts, session_attributes, intent,
                [{'contentType': 'PlainText', 'content': prompt}]
                )
        print("Checking confirmation",confirmation)
        if confirmation and confirmation != 'Yes':
            response = responses.get('FulfilmentCancelUpdate')
            return dialog.elicit_intent(active_contexts, 
                        session_attributes, intent, 
                        [{'contentType': 'PlainText', 'content': response}])
        print("Checking booking_date ", booking_date)
        if booking_date:
            try:
                booking_datetime = datetime.strptime(booking_date, "%Y-%m-%d")
            except:
                prompt = prompts.get('InvalidDate')
                return dialog.elicit_slot(
                    'BookingDate', active_contexts, session_attributes, intent,
                    [{'contentType': 'PlainText', 'content': prompt}]
                    )
        print("Checking booking_time ", booking_date)
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
        print("Checking all", reservation_id , booking_date , booking_time , capacity , confirmation) 
        if reservation_id and booking_date and booking_time and capacity and confirmation:
            if confirmation == 'Yes':
                response_msg = restaurant_system.edit_reservation(restaurant_name, reservation_id, booking_date, booking_time, capacity, client)
                if "Reservation successfully edited" in response_msg:
                    response = responses.get('FulfilmentSuccess', restaurant_name=restaurant_name, reservation_id=reservation_id, booking_date=booking_date, booking_time=booking_time, capacity=capacity)
                else:
                    response = responses.get('FulfilmentFailed', restaurant_name=restaurant_name, reservation_id=reservation_id, error_msg = response_msg)
                
            return dialog.elicit_intent(active_contexts, 
                            session_attributes, intent, 
                            [{'contentType': 'PlainText', 'content': response}])
    print("Delegating")
    return dialog.delegate(active_contexts, session_attributes, intent)                    
