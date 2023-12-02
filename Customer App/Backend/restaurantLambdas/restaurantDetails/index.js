const AWS = require("aws-sdk");
const axios = require("axios");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
exports.handler = async (event) => {
  try{
    const params = {
        TableName: resTab,
        Key: {
            'restaurant_id':event.params.querystring.restaurantId
        }
    };
    const data = await dynamoDB.get(params).promise();
    console.log(data)
    const restaurantReviews= await axios.get(`https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant/review?restaurantId=${event.params.querystring.restaurantId}`);
    console.log(restaurantReviews)
    if(restaurantReviews){
    const resReviews= JSON.parse(restaurantReviews.data.body);
    data.Item.Reviews=resReviews;
    }
    if(data.Item.menu){
    for(const menu of data.Item.menu){
        const menuName=menu.name;
        const restaurantMenuReviews=await axios.get((`https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant/review?restaurantId=${event.params.querystring.restaurantId}&menuName=${menuName}`));
        console.log(restaurantMenuReviews)
        if(restaurantMenuReviews){
            const menuReview=JSON.parse(restaurantMenuReviews.data.body);
            menu.Reviews=menuReview;
        }
    }
    }
    return {
        statusCode:200,
        body:JSON.stringify(data)
    };
    }catch(error){
        return { error };
    }
};
