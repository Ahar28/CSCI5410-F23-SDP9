
const AWS = require("aws-sdk");
AWS.config.update({
    region:'us-east-1'
})
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const mime = require("mime");
const resTab = 'restaurant_details';
const bucketName= 'sdp9restimages'
exports.handler = async (event) => {
  const {restaurantId,menuName,menuImage,isAvailable,price,userId} = event['body-json'];
  let uploadedImageLink = await uploadImages(menuImage,restaurantId,menuName);
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
          is_available:isAvailable,
          percent_offer:0
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

async function uploadImages(menuImage,restaurantId,menuName){
    const base64Data = new Buffer.from(menuImage.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = menuImage.split(';')[0].split('/')[1];
    const objectKey = restaurantId+'_image_'+menuName+"."+mime.getExtension(type);
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: base64Data,
      ContentType:`image/${type}`,
      ACL: 'public-read',
      ContentEncoding: 'base64'
    };
    try {
      const data = await s3.upload(params).promise();
      return data.Location
    } catch (error) {
      throw error;
    }
}
