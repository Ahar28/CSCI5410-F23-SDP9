const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details';
exports.handler = async (event) => {
  const {restaurantId,restaurantOffer,userId}=event['body-json'];
  const params = {
    TableName: resTab,
    Key: { restaurant_id:restaurantId }, 
    UpdateExpression: 'SET #restaurant_offer = :restaurantOffer',
    ExpressionAttributeNames: { '#restaurant_offer': 'restaurant_offer' },
    ExpressionAttributeValues: {
      ':restaurantOffer':restaurantOffer
    },
    ConditionExpression: 'user_id = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ReturnValues: 'ALL_NEW',
  }
  try {
    const data = await dynamoDB.update(params).promise();
    const response = {
      statusCode: 200,
      body:JSON.stringify("Data has been updated successfully"),
    };
    return response;
  } catch(error){
      const response = {
      statusCode: 200,
      body: JSON.stringify(error),
    };
    return response;
  }
};
