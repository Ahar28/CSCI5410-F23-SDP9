const AWS = require("aws-sdk");
const uuid = require("uuid");
const mime = require("mime");
AWS.config.update({
    region:'us-east-1'
})
const s3 = new AWS.S3();

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bucketName = 'sdp9restimages';
const resTab = 'restaurant_details';
exports.handler = async (event) => {
  const {restaurantName,base64Images,isOpen,address,userId} = event['body-json'];
  const restaurantId = uuid.v4();
  let uploadedImageLinks = await uploadImages(base64Images,restaurantName);
  const params = {
    TableName: resTab,
    Item: {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName, 
      address: address,
      is_open:isOpen,
      images:uploadedImageLinks,
      user_id:userId
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
    const base64Data = new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const type = base64Image.split(';')[0].split('/')[1];
    const objectKey = restaurantName+'_image_'+i+"."+type;
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
      uploadedImageLinks.push(data.Location);
    } catch (error) {
      throw error;
    }
      i++;
  }
  return uploadedImageLinks;
}