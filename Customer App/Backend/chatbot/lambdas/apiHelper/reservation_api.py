import json
import requests
from datetime import datetime, timedelta
import calendar

reservations_by_restaurant_id_endpoint ='https://v4ic130p27.execute-api.us-east-1.amazonaws.com/dev/get-reserversation-byresid?restaurant_id='
book_reservation_endpoint = 'https://b7g6enck49.execute-api.us-east-1.amazonaws.com/dev/create-reservation'
delete_reservation_endpoint = 'https://8ayj6o7wsi.execute-api.us-east-1.amazonaws.com/dev/delete-reservation-partnerapp?reservation_id='
edit_reserveration_endpoint = 'https://38irl8wai5.execute-api.us-east-1.amazonaws.com/dev/edit-reservation'

def getReservations(restaurant_id):
    restaurant_reservation_endpoint = reservations_by_restaurant_id_endpoint + restaurant_id
    response =  requests.get(restaurant_reservation_endpoint)
    print("reservation response", response.json()['document'])
    reservations = response.json()['document']
    
    for i in range(len(reservations)):
        reservation_timestamp = reservations[i]['data']['reservation_date']['_seconds']
        reservation_datetime = datetime.fromtimestamp(reservation_timestamp)
        print("Found reservation on ", reservation_datetime)
        reservations[i]['datetime'] = reservation_datetime
    return reservations

def getAllReservations(restaurant_id):
    reservations = getReservations(restaurant_id)
    all_reservations = []
    for reservation in reservations:
        reservation['datetime'] = reservation['datetime'].strftime("%Y-%m-%d %H:%M:%S")
        all_reservations.append(reservation)
    return all_reservations
    
def getReservationsInDuration(restaurant_id, date, duration):
    reservations = getReservations(restaurant_id)
    print("Finding reserversations on date", date, reservations)
    
    reservations_on_date = []
    
    for reservation in reservations:
        if date < reservation['datetime'] < date + timedelta(days=duration):
            reservation['datetime'] = reservation['datetime'].strftime("%Y-%m-%d %H:%M:%S")
            reservations_on_date.append(reservation)
    
    return reservations_on_date
    
def getReservationsByDate(restaurant_id, date):
    return getReservationsInDuration(restaurant_id, date, 1)

def getReservationsByWeek(restaurant_id, date):
    return getReservationsInDuration(restaurant_id, date, 7)
    
def getReservationsByMonth(restaurant_id, date):
    _, number_of_days = calendar.monthrange(date.year, date.month)
    return getReservationsInDuration(restaurant_id, date, number_of_days)
    
def bookAReservation(restaurant_name, restaurant_id, booking_date, booking_time, capacity, user_id, user_email, menu_items):
    
    booking_data = {
        "no_of_people":capacity,
        "reservationDate":f"{booking_date} {booking_time}",
        "user_id":user_id,
        "user_email": user_email,
        "restaurant_id":restaurant_id,
        "restaurant_name": restaurant_name,
        "selectedMenuItems": menu_items
    }
    print("Sending data to make reservation", booking_data)
    response =  requests.post(book_reservation_endpoint, json=booking_data)
    print("Reservation response", response.json())
    
    try:
        if response.json()["message"]:
            return response.json()["message"]
    except:
        return "Server error"
        
def deleteReservation(reservation_id):
    delete_reservation_url = delete_reservation_endpoint + reservation_id
    response = requests.delete(delete_reservation_url)
    try:
        if "Reservation successfully deleted" in response.json()["message"]:
            return True
    except:
        return False
    return False

def editReservation(restaurant_id, reservation_id, user_id, booking_date, booking_time, capacity):
    edit_reservation_data = {
        "no_of_people": capacity,
        "newreservationDate": f"{booking_date} {booking_time}",
        "user_id": user_id,
        "reservation_id": reservation_id,
        "restaurant_id": restaurant_id,
    }
    print("edit data", edit_reservation_data)
    response = requests.put(edit_reserveration_endpoint, json=edit_reservation_data)
    print(response.json())
    try:
        return response.json()["message"]
    except:
        return "Server issue"
    return "Server issue"