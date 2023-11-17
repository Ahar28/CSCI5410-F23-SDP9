
const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const resTab = 'restaurant_details';
const bucketName= 'sdp9restimages'
exports.handler = async (event) => {
  const {restaurantId,restaurantName,menuName,menuImage,isAvailable,price} = event['body-json'];
  let uploadedImageLink = uploadImages(menuImage,restaurantName,menuName);
  const params = {
    TableName: resTab,
    Key: { restaurant_id:restaurantId }, 
    UpdateExpression: 'SET #menu = list_append(if_not_exists(#menu, :empty_list), :new_item)',
    ExpressionAttributeNames: { '#menu': 'menu' },
    ExpressionAttributeValues: {
      ':new_item': [ 
        {
          name: menuName,
          image:uploadedImageLink,
          price,
          is_available:isAvailable
        },
      ],
      ':empty_list': [],
    },
    ReturnValues: 'ALL_NEW',
  };
  try {
    const data = await dynamoDB.update(params).promise();
    const response = {
      statusCode: 200,
      body:JSON.stringify("Data has been updated successfully"),
    };
    return response;
  } catch(error){
      const response = {
      statusCode: 200,
      body: JSON.stringify(error),
    };
    return response;
  }
};

async function uploadImages(menuImage,restaurantName,menuName){
    const imageBuffer = Buffer.from(menuImage, 'base64');
    const objectKey = restaurantName+'_image_'+menuName+'_image.jpg';
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: imageBuffer,
    };
    try {
      const data = await s3.upload(params).promise();
      return data;
    } catch (error) {
      throw error;
    }
}
