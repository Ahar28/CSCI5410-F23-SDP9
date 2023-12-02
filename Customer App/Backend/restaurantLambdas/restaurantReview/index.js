const AWS = require("aws-sdk");
const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./service-account.json"); 
const resTab='restaurant_details'
const dynamoDB = new AWS.DynamoDB.DocumentClient();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-term-assignment.firebaseio.com",
});
exports.handler = async (event) => {
  try{
        const body = event['body-json'];
        const db = admin.firestore();
        const overallReviewdata = await getOverallReviews(body.restaurant_id);
        const overRatingValue = overallReviewdata.restaurant_review_overall.total_ratingvalue+body.reviewObj.rating;
        const overRatingCount = overallReviewdata.restaurant_review_overall.total_numberratings+1;
        const params = {
            TableName: resTab,
            Key: { restaurant_id: body.restaurant_id },
            UpdateExpression: 'SET #restaurant_review_overall = :newOverallRating',
            ExpressionAttributeNames: { '#restaurant_review_overall':'restaurant_review_overall' },
            ExpressionAttributeValues: {
                ':newOverallRating':{
                    total_ratingvalue:overRatingValue,
                    total_numberratings:overRatingCount
                }
            },
            ReturnValues: 'UPDATED_NEW',
        };
        
        const data = await dynamoDB.update(params).promise();
        const reviewDocs = db.collection("restaurant-reviews");
        const addReview= await reviewDocs.add({
            restaurantId:body.restaurant_id,
            review:body.reviewObj.review,
            rating:body.reviewObj.rating,
            userId:body.reviewObj.user_id
        })
        if(data && addReview){
            return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Review posted successfully'
            })}
        }     
    } catch(error){
        console.log(error)
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
    let resRevOverall
    if(data.Item.restaurant_review_overall){
        resRevOverall=data.Item.restaurant_review_overall
    } else{
        resRevOverall={
            total_ratingvalue:0,
            total_numberratings:0
        };
    }
    const returnData = {
        restaurant_name:data.Item.restaurant_name,
        restaurant_review_overall:resRevOverall,
    }
    return returnData;
    } catch(error){
        return { error };
    }
}

