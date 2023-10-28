import json
import requests

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
  
def lambda_handler(event, context):
    print(event,context)
    values = None
    if event['function'] == 'getAllRestaurantNames':
      values = getAllRestaurantNames()
    elif event['function'] == 'getRestaurantDetails':
      values = getAllRestaurantNames(event['restaurant_id'])
    elif event['function'] == 'getRestaurantDetailsWithName':
      values = getRestaurantDetailsWithName(event['restaurant_name'])
      
    return {
        'statusCode': 200,
        'values': values
    }
