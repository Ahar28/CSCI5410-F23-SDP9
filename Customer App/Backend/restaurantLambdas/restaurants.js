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
async function getListofRestaurants(){
    try{
    const params={
        TableName: resTab
    };
    const data = await scanDynamoRecords(params,[]);
    let sendData=[];
    
    for(let obj of data){
        let currObj = {
            restaurant_name : obj.restaurant_name,
            restaurant_id : obj.restaurant_id,
            address : obj.address,
            images : obj.images,
            is_open : obj.is_open
        }
        sendData.push(currObj);
    }
    return {
        statusCode:200,
        body:JSON.stringify(sendData)
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
module.exports ={
    getRestaurants,getListofRestaurants
}