def checkAccess(event):
    VAILD_KEY = "bb17b2ae8894ab8c1bc4407e57c26cf07c3fa3f1"
    print(event)
    
    if'access_key' not in event['headers'] or VAILD_KEY != event['headers']['access_key']:
        return False
    return True