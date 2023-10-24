const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
const restaurantPath = '/restaurant';
const restaurantsPath = '/restaurants';
const menuPath = restaurantPath+'/menu';
const availabilityPath = restaurantPath+'/availabletime';
const listPath = restaurantsPath + '/list';
exports.handler = async function(event,context) {
    let response;
    switch(true){
        case event.context["http-method"]=='GET' && event.context["resource-path"]==restaurantPath:
            response = await getRestaurant(event.params.querystring.restaurantId);
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==restaurantsPath:
            response = await getRestaurants();
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==menuPath:
            response = await getMenu(event.params.querystring.restaurantId);
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==availabilityPath:
            response = await getAvailability(event.params.querystring.restaurantId);
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==listPath:
            response = await getListofRestaurants();
    }
    return response;
};
async function getRestaurant(restaurantId){
    try{
    const params = {
        TableName: resTab,
        Key: {
            'restaurant_id':restaurantId
        }
    };
    const data = await dynamoDB.get(params).promise();
    return {
        statusCode:200,
        body:JSON.stringify(data)
    };
    } catch(error){
        return { error };
    }
}

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
    console.log(data)
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
async function getMenu(restaurantId){
    try{
    const params = {
        TableName: resTab,
        Key: {
            'restaurant_id':restaurantId
        }
    };
    const data = await dynamoDB.get(params).promise();
    const menuData = data.Item.menu;
    return {
        statusCode:200,
        body:JSON.stringify(menuData)
    };
    } catch(error){
        return { error };
    }
}
async function getAvailability(restaurantId){
    try{
    const params = {
        TableName: resTab,
        Key: {
            'restaurant_id':restaurantId
        }
    };
    const data = await dynamoDB.get(params).promise();
    const availabilityData = data.Item.timings;
    return {
        statusCode:200,
        body:JSON.stringify(availabilityData)
    };
    } catch(error){
        return { error };
    }
}