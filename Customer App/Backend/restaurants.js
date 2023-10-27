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
const reviewPath = restaurantPath + '/review';
const menuReviewPath = menuPath+'/review';
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
            break;
        case event.context["http-method"]=='POST' && event.context["resource-path"]==reviewPath:
            response = await postReviewRating(event['body-json']);
            break;
        case event.context["http-method"]=='POST' && event.context["resource-path"]==menuReviewPath:
            response = await postMenuReviewRating(event['body-json']);
            break;
        
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
async function getOverallReviews(restaurantId){
    try{
    const params = {
        TableName: resTab,
        Key: {
            'restaurant_id':restaurantId
        }
    };
    const data = await dynamoDB.get(params).promise();
    const returnData = {
        restaurant_review_overall:data.Item.restaurant_review_overall,
        restaurant_reviews:data.Item.restaurant_reviews
    }
    return returnData;
    } catch(error){
        return { error };
    }
}
async function postReviewRating(body){
    try{
        
        const overallReviewdata = await getOverallReviews(body.restaurant_id);
        const overRatingCount = overallReviewdata.restaurant_review_overall.total_numberratings+1; 
        const overRatingValue = overallReviewdata.restaurant_review_overall.total_ratingvalue+body.reviewObj.rating;
        const existingReviews = overallReviewdata.restaurant_reviews || [];
        existingReviews.push({
            review: body.reviewObj.review,
            rating: body.reviewObj.rating,
            user_id: body.reviewObj.user_id
        });
        const params = {
            TableName: 'restaurant_details',
            Key: { restaurant_id: body.restaurant_id },
            UpdateExpression: 'SET #restaurant_reviews = :updatedReviews,#restaurant_review_overall = :newOverallRating',
            ExpressionAttributeNames: { '#restaurant_reviews': 'restaurant_reviews','#restaurant_review_overall':'restaurant_review_overall' },
            ExpressionAttributeValues: {
                ':updatedReviews': existingReviews,
                ':newOverallRating':{
                    total_ratingvalue:overRatingValue,
                    total_numberratings:overRatingCount
                }
            },
            ReturnValues: 'UPDATED_NEW',
        };
        
        const data = await dynamoDB.update(params).promise();
        if(data){
            return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Review posted successfully'
            })}
        }
        
    } catch(error){
        
        return { error };
    }
}
async function getMenuOverallReviews(restaurantId,name){
    try{
    const params = {
        TableName: resTab,
        Key: {
            'restaurant_id':restaurantId
        }
    };
    const data = await dynamoDB.get(params).promise();
    let menuData;
    for(const menuObj of data.Item.menu){
        if(menuObj.name == name){
            menuData=menuObj;
        }
    }
    const returnData = {
        menu_review_overall:menuData.menu_review_overall,
        reviews:menuData.reviews
    }
    return returnData;
    } catch(error){
        return { error };
    }
}
async function postMenuReviewRating(body){
    const restaurantId=body.restaurant_id;
    const menuName = body.menu_name;
    const review=body.reviewObj;
    try {
        // Get the restaurant item from DynamoDB based on restaurantId
        const params = {
            TableName: resTab,
            Key: {
                restaurant_id: restaurantId,
            },
        };
        
        const restaurantItem = await dynamoDB.get(params).promise();
        
        if (restaurantItem.Item) {
            const menus = restaurantItem.Item.menu;
           
            let menu;
            // Find the menu item by name
            for(const curr of menus){
                
                if(curr.name==menuName){
                    menu=curr;
                }
            }
            
            if (menu) {
                const newReview = {
                    rating: review.rating,
                    user_id: review.user_id,
                    review: review.review,
                };

                menu.reviews.push(newReview);

                // Recalculate the overall rating for the menu item
                let totalRatingValue = 0;
                let totalNumberRatings = 0;
                for (const menuReview of menu.reviews) {
                    totalRatingValue += menuReview.rating;
                    totalNumberRatings += 1;
                }

                menu.menu_review_overall.total_ratingvalue = totalRatingValue;
                menu.menu_review_overall.total_numberratings = totalNumberRatings;

                // Update the restaurant item in DynamoDB
                const updateParams = {
                    TableName: resTab,
                    Key: {
                        restaurant_id: restaurantId,
                    },
                    UpdateExpression: 'SET menu = :menus',
                    ExpressionAttributeValues: {
                        ':menus': menus,
                    },
                };

                await dynamoDB.update(updateParams).promise();

                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Review added and menu item updated successfully.' }),
                };
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Menu item not found.' }),
                };
            }
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Restaurant not found.' }),
            };
        }
    }  catch(error){
        
        return { error };
    }
}