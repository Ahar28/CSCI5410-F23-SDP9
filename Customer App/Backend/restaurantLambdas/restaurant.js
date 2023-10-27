const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
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
            TableName: resTab,
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
module.exports={
    getRestaurant,
    getMenu,
    postMenuReviewRating,
    postReviewRating,
    getAvailability
}