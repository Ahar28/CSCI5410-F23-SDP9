const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
exports.handler = async (event) => {
  try{
    const {restaurantId,availabilityData,userId}=event['body-json'];
    const timingData = {
      monday:{
        opening_time:availabilityData.opening_time,
        closing_time:availabilityData.closing_time
      },
      tuesday:{
        opening_time:availabilityData.opening_time,
        closing_time:availabilityData.closing_time
      },
      wednesday:{
        opening_time:availabilityData.opening_time,
        closing_time:availabilityData.closing_time
      },
      thursday:{
        opening_time:availabilityData.opening_time,
        closing_time:availabilityData.closing_time
      },
      friday:{
        opening_time:availabilityData.opening_time,
        closing_time:availabilityData.closing_time
      },
      saturday:{
        opening_time:availabilityData.opening_time,
        closing_time:availabilityData.closing_time
      },
      sunday:{
        opening_time:availabilityData.opening_time,
        closing_time:availabilityData.closing_time
      }
    }
    const params = {
    TableName: resTab,
    Key: { restaurant_id:restaurantId }, 
    UpdateExpression: 'SET #available_times:available_times, #timings = :timings',
    ExpressionAttributeNames: { '#available_times': 'available_times','#timings': 'timings' },
    ExpressionAttributeValues: {
      ':available_times': availabilityData,
      ':timings': timingData,
    },
    ConditionExpression: 'user_id = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
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
