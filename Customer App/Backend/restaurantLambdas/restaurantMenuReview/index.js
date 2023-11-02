const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
exports.handler = async (event) => {
    const body = event['body-json']
    const restaurantId=body.restaurant_id;
    const menuName = body.menu_name;
    const review=body.reviewObj;
    try {
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
                let totalRatingValue = 0;
                let totalNumberRatings = 0;
                for (const menuReview of menu.reviews) {
                    totalRatingValue += menuReview.rating;
                    totalNumberRatings += 1;
                }

                menu.menu_review_overall.total_ratingvalue = totalRatingValue;
                menu.menu_review_overall.total_numberratings = totalNumberRatings;
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
};
