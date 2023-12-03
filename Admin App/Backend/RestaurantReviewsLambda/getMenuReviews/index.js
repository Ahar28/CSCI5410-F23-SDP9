
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json"); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-term-assignment.firebaseio.com",
});
exports.handler = async (event) => {
  const restaurantId = event.params.querystring.restaurantId;
  const menuName=event.params.querystring.menuName;
  const db = admin.firestore();
  const reviewDocs = db.collection("restaurant-menu-reviews");
  const fieldName1 = 'restaurantId';
  const fieldName2 = 'menuName';
  const targetValue1 = restaurantId;
  const targetValue2 = menuName;
  const query = reviewDocs.where(fieldName1, '==', targetValue1).where(fieldName2,'==',targetValue2);
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
