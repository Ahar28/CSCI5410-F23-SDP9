import requests
update_timing_endpoint = 'https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/availability'
update_location_endpoint = 'https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/address'

def update_timings(openingTime, closingTime, restaurantId, userId):
    data =  { 
                "availabilityData":
                    {
                        "openingTime":openingTime,
                        "closingTime":closingTime
                    },
                "userId":userId,
                "restaurantId":restaurantId
            }
            
    response = requests.post(update_timing_endpoint, json=data)
    try:
        if 'Data has been updated successfully' in response.json()['body']:
            return True
    except:
        return False

def update_location(location, restaurantId):
    
    data =  { 
                "restaurantId":restaurantId,
                "address": location
            }
    print("Sending update request for id", data)        
    response = requests.post(update_location_endpoint, json=data)
    print(response.json())
    try:
        if 'Data has been updated successfully' in response.json()['body']:
            return True
    except:
        return False