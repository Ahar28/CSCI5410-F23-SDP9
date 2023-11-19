const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const resTab = 'restaurant_details'; 
exports.handler = async (event) => {
    const body = event['body-json']
    const restaurantId=body.restaurantId;
    const menuName = body.menu_name;
    const newAvailability=body.isAvailable;
    const userId = body.userId;
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

                menu.is_available=newAvailability;

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
                    body: JSON.stringify({ message: 'Availability Updated.' }),
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

