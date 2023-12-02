
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json"); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-term-assignment.firebaseio.com",
});
exports.handler = async (event) => {
  const restaurantId = event.params.querystring.restaurantId;
  const db = admin.firestore();
  const reviewDocs = db.collection("restaurant-reviews");
  const fieldName = 'restaurantId';
  const targetValue = restaurantId;
  const query = reviewDocs.where(fieldName, '==', targetValue);
  const reviewsSnapShot = await query.get();
  let data=[];
  reviewsSnapShot.forEach((reviewDoc)=>{
    data.push(reviewDoc.data());
  })
  console.log(data)
  const response = {
    statusCode: 200,
    body: JSON.stringify(data),
  };
  return response;
};
