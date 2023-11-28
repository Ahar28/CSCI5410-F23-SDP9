import functions_framework
import gspread 
from oauth2client.service_account import ServiceAccountCredentials 
from datetime import datetime 
import requests
import json
from service_credentials import getServiceCredentials
from lambda_access_key import getLambdaAccessKey

@functions_framework.http
def update(request): 
	# getting the variables ready 
	data = getServiceCredentials()

	lambda_url = "https://yo35vsj2cduxemjkwsnwj4jiqq0nxoqt.lambda-url.us-east-1.on.aws"
	response = requests.post(lambda_url, params=getLambdaAccessKey())
	restaurants = response.json()


	# use creds to create a client to interact with the Google Drive API 
	scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive'] 

	creds = ServiceAccountCredentials.from_json_keyfile_dict(data, scope) 

	client = gspread.authorize(creds) 

	# Find workbook by name and open the sheet 
	sheet = client.open("Top restaurants").worksheet('Orders') 
	sheet.clear()
	sheet.insert_row(["Restaurant Name", "Orders"])
	for restaurant in restaurants:
		sheet.insert_row(restaurant)

	return "Success"
