const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details';
exports.handler = async (event) => {
  try{
        const body = event['body-json'];
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
};
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