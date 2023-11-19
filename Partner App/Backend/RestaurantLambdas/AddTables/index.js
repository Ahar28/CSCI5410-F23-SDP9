const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details';
exports.handler = async (event) => {
  const {restaurantId,tableDetails,userId} = event['body-json'];
  const newTableDetails={
    size:tableDetails.tableSize,
    number:tableDetails.tableNumber
  }
  const params = {
    TableName: resTab,
    Key: { restaurant_id:restaurantId }, 
    UpdateExpression: 'SET #tables = list_append(if_not_exists(#tables, :empty_list), :new_item)',
    ExpressionAttributeNames: { '#tables': 'tables' },
    ExpressionAttributeValues: {
      ':new_item': [ 
        newTableDetails
      ],
      ':empty_list': [],
    },
    ReturnValues: 'ALL_NEW',
  };
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