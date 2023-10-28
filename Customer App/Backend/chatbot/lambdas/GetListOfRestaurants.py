import json
import boto3

client = boto3.client('lambda')

def lambda_handler(event, context):
    apiResponse = client.invoke(
            FunctionName = 'apiHelper',
            InvocationType = 'RequestResponse',
            Payload = json.dumps({'function':'getAllRestaurantNames'})
        )
    restaurant_names = json.load(apiResponse['Payload'])['values']

    response_format = '\n'.join(restaurant_names)

    return {
        'statusCode': 200,
        'body': response_format
    }

