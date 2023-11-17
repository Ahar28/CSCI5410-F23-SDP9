const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
exports.handler = async (event) => {
  try{
    const {restaurantId,availabilityData}=event['body-json'];
    const params = {
    TableName: resTab,
    Key: { restaurant_id:restaurantId }, 
    UpdateExpression: 'SET #available_times:available_times',
    ExpressionAttributeNames: { '#available_times': 'available_times' },
    ExpressionAttributeValues: {
      ':available_times': availabilityData,
    },
    ReturnValues: 'ALL_NEW',
  };
    const data = await dynamoDB.get(params).promise();
    return {
        statusCode:200,
        body:JSON.stringify("Data has been updated successfully")
    };
    } catch(error){
        return { error };
    }
};
