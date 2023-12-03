import json
import requests
from datetime import datetime

import reservation_api
import review_api
import update_api

api_endpoint = "https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant"

def getAllRestuarantsWithBasicInformation():
  restaurants_list_endpoint = api_endpoint + "s/list"
  response =  requests.get(restaurants_list_endpoint)
  restaurants = json.loads(response.json()['body'])
  
  return restaurants
  
def getAllRestaurantNames():
  restaurants = getAllRestuarantsWithBasicInformation()

  restaurant_names = []    
  for restaurant in restaurants:
      restaurant_names.append(restaurant['restaurant_name'])
      
  return restaurant_names

def getRestaurantDetails(restaurant_id):
  restaurant_detail_endpoint = api_endpoint + f"?restaurantId={restaurant_id}"
  response =  requests.get(restaurant_detail_endpoint)
  restaurant_details = json.loads(response.json()['body'])['Item']

  return restaurant_details
  
def getRestaurantDetailsWithName(restaurant_name):
  restaurants = getAllRestuarantsWithBasicInformation()
  
  for restaurant in restaurants:
      if restaurant_name.lower() == restaurant['restaurant_name'].lower():
          return getRestaurantDetails(restaurant['restaurant_id'])
    
  return None

def getRestaurantId(restaurant_name):
  return getRestaurantDetailsWithName(restaurant_name)['restaurant_id']
  
def getAllRestaurantOwners():
  restaurants = getAllRestuarantsWithBasicInformation()
  
  owners = {}
  
  for restaurant in restaurants:
    owner = restaurant['user_id']
    
    if owner not in owners:
      owners[owner] = []
    owners[owner].append(restaurant['restaurant_name'])
      
  return owners

def getRestaurantRating(restaurant_name):
  restaurant = getRestaurantDetailsWithName(restaurant_name)
  
  #Restaurant has no ratings
  if 'restaurant_review_overall' not in restaurant:
    return None
    
  rating = round(restaurant['restaurant_review_overall']['total_ratingvalue'] / restaurant['restaurant_review_overall']['total_numberratings'], 2)
  
  return rating

def getRestaurantReviews(restaurant_name):
  restaurant = getRestaurantDetailsWithName(restaurant_name)
  
  #Restaurant has no reviews
  if 'restaurant_reviews' not in restaurant:
    return None
    
  reviews = []
  for review in restaurant['restaurant_reviews']:
    reviews.append(review['review'])
  
  return reviews

def getRestaurantMenuItems(restaurant_name):
  restaurant = getRestaurantDetailsWithName(restaurant_name)
  
  if 'menu' not in restaurant:
    return []
    
  return restaurant['menu']

def getRestaurantMenuItemReviews(restaurant_name, menu_item):
  restaurant = getRestaurantDetailsWithName(restaurant_name)
    
  
  for item in restaurant["menu"]:
    if item['name'].lower() == menu_item.lower():
      if "reviews" not in item:
        return None
        
      reviews = []
      for review in item['reviews']:
        reviews.append(review['review'])
      return reviews
      
  return None
  
def getRestaurantReservationsBookingByDate(restaurant_name, date):
  restaurant_id = getRestaurantId(restaurant_name)
  date = datetime.strptime(date, "%Y-%m-%d")
  
  return reservation_api.getReservationsByDate(restaurant_id, date)

def getRestaurantReservationsBookingByWeek(restaurant_name, date):
  restaurant_id = getRestaurantId(restaurant_name)
  date = datetime.strptime(date, "%Y-%m-%d")
  
  return reservation_api.getReservationsByWeek(restaurant_id, date)

def getRestaurantReservationsBookingByMonth(restaurant_name, date):
  restaurant_id = getRestaurantId(restaurant_name)
  date = datetime.strptime(date, "%Y-%m-%d")
  
  return reservation_api.getReservationsByMonth(restaurant_id, date)

def bookAReservation(restaurant_name, booking_date, booking_time, capacity, user_id):
  restaurant_id = getRestaurantId(restaurant_name)
  return reservation_api.bookAReservation(restaurant_name, restaurant_id, booking_date, booking_time, capacity, user_id)

def provideRestaurantReviewRating(restaurant_name, review, rating, user_id):
  restaurant_id = getRestaurantId(restaurant_name)
  return review_api.give_restaurant_review_rating(restaurant_id, review, rating, user_id)

def provideMenuItemReviewRating(restaurant_name, menu_item, review, rating, user_id):
  restaurant_id = getRestaurantId(restaurant_name)
  return review_api.give_menu_item_review_rating(restaurant_id, menu_item, review, rating, user_id)

def getMenuItemNames(restaurant_name):
  restaurant_details = getRestaurantDetailsWithName(restaurant_name)
  menu_names = []
  for menu in restaurant_details['menu']:
    menu_names.append(menu['name'])
  return menu_names

def updateTimings(restaurant_name, opening_time, closing_time, user_id):
  restaurant_id = getRestaurantId(restaurant_name)
  opening_time = int(opening_time[:2])*100 + int(opening_time[3:])
  closing_time = int(closing_time[:2])*100 + int(closing_time[3:])
  return update_api.update_timings(opening_time, closing_time, restaurant_id, user_id)
  
  
  
def lambda_handler(event, context):
    print(event,context)
    values = None
    if event['function'] == 'getAllRestaurantNames':
      values = getAllRestaurantNames()
    elif event['function'] == 'getRestaurantDetails':
      values = getAllRestaurantNames(event['restaurant_id'])
    elif event['function'] == 'getRestaurantDetailsWithName':
      values = getRestaurantDetailsWithName(event['restaurant_name'])
    elif event['function'] == 'getAllRestaurantOwners':
      values = getAllRestaurantOwners()
    elif event['function'] == 'getRestaurantRating':
      values = getRestaurantRating(event['restaurant_name'])
    elif event['function'] == 'getRestaurantReviews':
      values = getRestaurantReviews(event['restaurant_name'])
    elif event['function'] == 'getRestaurantMenuItems':
      values = getRestaurantMenuItems(event['restaurant_name'])
    elif event['function'] == 'getRestaurantMenuItemReviews':
      values = getRestaurantMenuItemReviews(event['restaurant_name'], event['menu_item'])
    elif event['function'] == 'getAllRestuarantsWithBasicInformation':
      values = getAllRestuarantsWithBasicInformation()
    elif event['function'] == 'getRestaurantReservationsBookingByDate':
      values = getRestaurantReservationsBookingByDate(event['restaurant_name'], event['date'])
    elif event['function'] == 'getRestaurantReservationsBookingByWeek':
      values = getRestaurantReservationsBookingByWeek(event['restaurant_name'], event['date'])
    elif event['function'] == 'getRestaurantReservationsBookingByMonth':
      values = getRestaurantReservationsBookingByMonth(event['restaurant_name'], event['date'])
    elif event['function'] == 'bookAReservation':
      values = bookAReservation(event['restaurant_name'], event['booking_date'], event['booking_time'], event['capacity'], event['user_id'])
    elif event['function'] == 'provideRestaurantReviewRating':
      values = provideRestaurantReviewRating(event['restaurant_name'], event['review'], event['rating'], event['user_id'])
    elif event['function'] == 'provideMenuItemReviewRating':
      values = provideMenuItemReviewRating(event['restaurant_name'], event['menu_item'], event['review'], event['rating'], event['user_id'])
    elif event['function'] == 'getMenuItemNames':
      values = getMenuItemNames(event['restaurant_name'])
    elif event['function'] == 'updateTimings':
      values = updateTimings(event['restaurant_name'], event['opening_time'], event['closing_time'], event['user_id'])
      
    print("Returning values",values)
    return {
        'statusCode': 200,
        'values': values
    }
