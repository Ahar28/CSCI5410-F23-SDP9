const AWS = require("aws-sdk");
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json"); 
const resTab='restaurant_details'
const dynamoDB = new AWS.DynamoDB.DocumentClient();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-term-assignment.firebaseio.com",
});; 
exports.handler = async (event) => {
    const body = event['body-json']
    const db = admin.firestore();
    console.log(db)
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
        console.log(restaurantItem)
        if (restaurantItem.Item) {
            const menus = restaurantItem.Item.menu;
           console.log(menus)
            let menu;
            // Find the menu item by name
            for(const curr of menus){
                
                if(curr.name==menuName){
                    menu=curr;
                }
            }
            console.log(menu)
            if (menu) {
                if(menu.menu_review_overall){
                    menu.menu_review_overall.total_ratingvalue += review.rating;
                    menu.menu_review_overall.total_numberratings += 1;
                } else{
                    const menuObj= {
                        total_numberratings:1,
                        total_ratingvalue:review.rating,
                    }
                    menu.menu_review_overall=menuObj
                }
                const newMenus=menus;
                console.log(newMenus)
                // Update the restaurant item in DynamoDB
                const updateParams = {
                    TableName: resTab,
                    Key: {
                        restaurant_id: restaurantId,
                    },
                    UpdateExpression: 'SET menu = :menus',
                    ExpressionAttributeValues: {
                        ':menus': newMenus,
                    },
                };

                await dynamoDB.update(updateParams).promise();
                
                const menureviewDocs = db.collection("restaurant-menu-reviews");
                console.log(menureviewDocs)
                const addReview= await menureviewDocs.add({
                    restaurantId:body.restaurant_id,
                    review:review.review,
                    rating:review.rating,
                    userId:review.user_id,
                    menuName
                })
                console.log(addReview)
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
