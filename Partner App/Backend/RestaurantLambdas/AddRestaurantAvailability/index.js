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
        opening_time:availabilityData.openingTime,
        closing_time:availabilityData.closingTime
      },
      tuesday:{
        opening_time:availabilityData.openingTime,
        closing_time:availabilityData.closingTime
      },
      wednesday:{
        opening_time:availabilityData.openingTime,
        closing_time:availabilityData.closingTime
      },
      thursday:{
        opening_time:availabilityData.openingTime,
        closing_time:availabilityData.closingTime
      },
      friday:{
        opening_time:availabilityData.openingTime,
        closing_time:availabilityData.closingTime
      },
      saturday:{
        opening_time:availabilityData.openingTime,
        closing_time:availabilityData.closingTime
      },
      sunday:{
        opening_time:availabilityData.openingTime,
        closing_time:availabilityData.closingTime
      }
    }
    const newAvailabilityData={
      opening_time:availabilityData.openingTime,
      closing_time:availabilityData.closingTime
    }
    const params = {
    TableName: resTab,
    Key: { restaurant_id:restaurantId }, 
    UpdateExpression: 'SET available_times=:available_times, timings = :timings',
    ExpressionAttributeValues: {
      ':available_times': newAvailabilityData,
      ':timings': timingData,
    },
    ReturnValues: 'ALL_NEW',
  };
    const data = await dynamoDB.update(params).promise();
    return {
        statusCode:200,
        body:JSON.stringify("Data has been updated successfully")
    };
    } catch(error){
        return { error };
    }
};
