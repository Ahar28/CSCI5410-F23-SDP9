const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
async function getRestaurants(){
    try{
    const params={
        TableName: resTab
    };
    const data = await scanDynamoRecords(params,[]);
    return {
        statusCode:200,
        body:JSON.stringify(data)
    };
    } catch(error){
        return {error};
    }
}
async function scanDynamoRecords(scanParams,itemArray){
    try{
        const dynamoRecords = await dynamoDB.scan(scanParams).promise();
        itemArray=itemArray.concat(dynamoRecords.Items);
        if(dynamoRecords.lastEvaluatedKey){
            scanParams.ExclusiveStartKey=dynamoRecords.lastEvaluatedKey;
            return await scanDynamoRecords(scanParams,itemArray);
        }
        return itemArray;
    } catch(error){
        return {error};
    }
}