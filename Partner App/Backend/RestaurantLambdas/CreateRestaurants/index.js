const AWS = require("aws-sdk");
const uuid = require("uuid");
AWS.config.update({
    region:'us-east-1'
})
const s3 = new AWS.S3();

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bucketName = 'sdp9restimages';
const resTab = 'restaurant_details';
exports.handler = async (event) => {
  const {restaurantName,base64Images,isOpen,address} = event['body-json'];
  const restaurantId = uuid.v4();
  let uploadedImageLinks = uploadImages(base64Images,restaurantName);
  const params = {
    TableName: resTab,
    Item: {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName, 
      address: address,
      is_open:isOpen,
      images:uploadedImageLinks
    },
  }
  try{
  const data = await dynamoDB.put(params).promise();
  const response = {
    statusCode: 200,
    body:JSON.stringify("Data Has been stored successfully"),
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

async function uploadImages(base64Images,restaurantName){
  let uploadedImageLinks = [];
  let i = 0;
  for(const base64Image of base64Images){
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const objectKey = restaurantName+'_image_'+i+'.jpg';
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: imageBuffer,
    };
    try {
      const data = await s3.upload(params).promise();
      uploadedImageLinks.push(data);
    } catch (error) {
      throw error;
    }
      i++;
  }
  return uploadedImageLinks;
}