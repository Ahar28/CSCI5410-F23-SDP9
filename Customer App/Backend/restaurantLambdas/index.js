const restaurantPath = '/restaurant';
const restaurantsPath = '/restaurants';
const menuPath = restaurantPath+'/menu';
const availabilityPath = restaurantPath+'/availabletime';
const listPath = restaurantsPath + '/list';
const reviewPath = restaurantPath + '/review';
const menuReviewPath = menuPath+'/review';
const {getListofRestaurants,getRestaurants}=require('./restaurants');
const {getRestaurant,getMenu,getAvailability,postReviewRating,postMenuReviewRating}=require("./restaurant");
exports.handler = async function(event,context) {
    let response;
    switch(true){
        case event.context["http-method"]=='GET' && event.context["resource-path"]==restaurantPath:
            response = await getRestaurant(event.params.querystring.restaurantId);
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==restaurantsPath:
            response = await getRestaurants();
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==menuPath:
            response = await getMenu(event.params.querystring.restaurantId);
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==availabilityPath:
            response = await getAvailability(event.params.querystring.restaurantId);
            break;
        case event.context["http-method"]=='GET' && event.context["resource-path"]==listPath:
            response = await getListofRestaurants();
            break;
        case event.context["http-method"]=='POST' && event.context["resource-path"]==reviewPath:
            response = await postReviewRating(event['body-json']);
            break;
        case event.context["http-method"]=='POST' && event.context["resource-path"]==menuReviewPath:
            response = await postMenuReviewRating(event['body-json']);
            break;
        
    }
    return response;
};