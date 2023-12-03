import json
import requests

restaurant_review_endpoint = 'https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant/review'
menu_item_review_endpoint = 'https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant/menu/review'

def give_restaurant_review_rating(restaurant_id, review, rating, user_id):
    json_data = {
        "restaurant_id":restaurant_id,
        "reviewObj":{
            "user_id": user_id,
            "review": review,
            "rating": rating
        }
}
    print("Sending data to add restaurant review and rating", json_data)
    response =  requests.post(restaurant_review_endpoint, json=json_data)
    print("Review response", response.json())
    
    try:
        response_msg = json.loads(response.json()['body'])
        print("response msg", response_msg)
        if response_msg['message'] == 'Review posted successfully':
            return True
    except:
        return False
    return False

def give_menu_item_review_rating(restaurant_id, menu_item, review, rating, user_id):
    json_data = {
        "restaurant_id":restaurant_id,
        "menu_name": menu_item,
        "reviewObj":{
            "user_id": user_id,
            "review": review,
            "rating": rating
        }
}
    print("Sending data to add menu review and rating", json_data)
    response =  requests.post(menu_item_review_endpoint, json=json_data)
    print("menu response", response.json())
    
    try:
        response_msg = json.loads(response.json()['body'])
        print("response msg", response_msg)
        if response_msg['message'] == 'Review added and menu item updated successfully.':
            return True
    except:
        return False
    return False