import requests
update_timing_endpoint = 'https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/availability'

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