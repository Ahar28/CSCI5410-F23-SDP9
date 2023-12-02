import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../RestaurantDetails.css";
import { Button } from "antd";
import axios from "axios";
import { auth } from "../config/firebase";
import CreateMenuPopup from "./popups/CreateMenuPopup";
import AddTablesPopup from "./popups/AddTablesPopup";
import AddRestaurantOfferPopup from "./popups/AddRestaurantOfferPopup";
import AddMenuOfferPopup from "./popups/AddMenuOfferPopup";
import UpdateMenuAvailabilityPopup from "./popups/UpdateMenuAvailabilityPopup";
import ChangeAvailabilityPopup from "./popups/ChangeAvailabilityPopup";
import './../popup.css';

function RestaurantDetails() {
  const navigate = useNavigate();

  const { restaurant_id } = useParams();
  const [isAddMenuPopupOpen,setAddMenuPopup]=useState(false);
  const [isAddMenuOfferPopupOpen,setAddMenuOfferPopup]=useState(false);
  const [isUpdateMenuAvailabilityPopupOpen,setUpdateMenuAvailabilityPopup]=useState(false);
  const [isAddTablePopupOpen,setAddTablePopup]=useState(false);
  const [isAddRestaurantOfferPopupOpen,setAddRestaurantOfferPopup]=useState(false);
  const [isChangeAvailabilityPopupOpen,setChangeAvailabilityPopup]=useState(false);
  const [itemName,setItemName]=useState('');
  const [restaurantData, setRestaurantData] = useState({
    restaurant_name: "indian cuisine",
    address: "100, This street, Halifax, NS A1B 2C3",
    images: [
      "https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
    ],
    is_open: true,
    menu: [
      {
        image:
          "https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
        is_available: true,
        menu_review_overall: {
          total_numberratings: 2,
          total_ratingvalue: 8,
        },
        name: "Starter",
        percent_offer: 10,
        price: 12.99,
        reviews: [
          {
            rating: 4,
            review: "good taste",
            user_id: 1,
          },
          {
            rating: 4,
            review: "should try atleast once",
            user_id: 2,
          },
        ],
      },
      {
        image:
          "https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
        is_available: true,
        menu_review_overall: {
          total_numberratings: 1,
          total_ratingvalue: 5,
        },
        name: "Shahi Paneer",
        percent_offer: 5,
        price: 18.99,
        reviews: [
          {
            rating: 5,
            review: "good taste",
            user_id: 1,
          },
        ],
      },
    ],
    restaurant_offer: "up to 10% off",
    restaurant_reviews: [
      {
        rating: 5,
        review: "good Restaurant",
        user_id: 1,
      },
      {
        rating: 4,
        review: "good atmosphere",
        user_id: 2,
      },
    ],
    restaurant_review_overall: {
      total_numberratings: 2,
      total_ratingvalue: 9,
    },
    tables: [
      {
        number: 1,
        size: 6,
      },
      {
        number: 2,
        size: 4,
      },
    ],
    timings: {
      monday: {
        opening_time: 1100,
        closing_time: 2200,
      },
      tuesday: {
        opening_time: 1100,
        closing_time: 2200,
      },
      wednesday: {
        opening_time: 1100,
        closing_time: 2200,
      },
      thursday: {
        opening_time: 1100,
        closing_time: 2200,
      },
      friday: {
        opening_time: 1100,
        closing_time: 2200,
      },
      saturday: {
        opening_time: 1100,
        closing_time: 2200,
      },
      sunday: {
        opening_time: 1100,
        closing_time: 2200,
      },
    },
  });
  
  const openMenuPopup=()=>{
    setAddMenuPopup(true);
  }
  const closeAddMenuPopup=()=>{
    setAddMenuPopup(false);
  }
  const handleMenuChange=async(menuData)=>{
    const bodyData = {
      restaurantId:restaurantData.restaurant_id,
      menuName:menuData.menuName,
      menuImage:menuData.menuImage,
      isAvailable:menuData.isAvailable,
      price:menuData.price,
      userId:auth.currentUser.uid
    }
    const headers = {
      "Content-type": "application/json",
  };
  const resData = await axios.post(
      `https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/menu`,bodyData,
      { headers }
  );
  console.log(resData);
  window.location.reload(); 
  }
  const openAddMenuOfferPopup=(menuName)=>{
    setItemName(menuName);
    setAddMenuOfferPopup(true)
  }
  const closeAddMenuOfferPopup=()=>{
    setAddMenuOfferPopup(false)
  }
  const handleAddMenuOfferPopup=async(menuOffer)=>{
    const bodyData = {
      menu_name:itemName,
      offer:menuOffer,
      userId:auth.currentUser.uid,
      restaurantId:restaurantData.restaurant_id
    }
    const headers = {
      "Content-type": "application/json",
  };
  const resData = await axios.post(
      `https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/menu/offer`,bodyData,
      { headers }
  );
  console.log(resData);
  setItemName('');
  window.location.reload(); 
  }
  const openUpdateMenuAvailabilityPopup=(menuName)=>{
    setItemName(menuName);
    setUpdateMenuAvailabilityPopup(true)
  }
  const closeUpdateMenuAvailabilityPopup=()=>{
    setUpdateMenuAvailabilityPopup(false);
  }
  const handleUpdateMenuAvailability=async(menuAvailability)=>{
    const bodyData = {
      menu_name:itemName,
      isAvailable:menuAvailability,
      userId:auth.currentUser.uid,
      restaurantId:restaurantData.restaurant_id
    }
    const headers = {
      "Content-type": "application/json",
  };
  const resData = await axios.post(
      `https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/menu/availability`,bodyData,
      { headers }
  );
  console.log(resData);
  window.location.reload(); 
  setItemName('');
  }
  const openAddTablePopup=()=>{
    setAddTablePopup(true);
  }
  const closeAddTablePopup=()=>{
    setAddTablePopup(false);
  }
  const handleTableChange=async(tableData)=>{
    const bodyData = {
      tableDetails:tableData,
      userId:auth.currentUser.uid,
      restaurantId:restaurantData.restaurant_id
    }
    const headers = {
      "Content-type": "application/json",
  };
  const resData = await axios.post(
      `https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/table`,bodyData,
      { headers }
  );
  console.log(resData);
  window.location.reload(); 
  }
  const openAddRestaurantOfferPopup=()=>{
    setAddRestaurantOfferPopup(true)
  }
  const closeAddRestaurantOfferPopup=()=>{
    setAddRestaurantOfferPopup(false)
  }
  const handleAddRestaurantOffer=async(restaurantOffer)=>{
    const bodyData = {
      restaurantOffer:restaurantOffer,
      userId:auth.currentUser.uid,
      restaurantId:restaurantData.restaurant_id
    }
    const headers = {
      "Content-type": "application/json",
  };
  const resData = await axios.post(
      `https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/offer`,bodyData,
      { headers }
  );
  console.log(resData);
  window.location.reload(); 
  }
  const openChangeAvailabilityPopup=()=>{
    setChangeAvailabilityPopup(true)
  }
  const closeChangeAvailabilityPopup=()=>{
    setChangeAvailabilityPopup(false)
  }
  const handleChangeAvailability=async(availabilityData)=>{
    const bodyData = {
      availabilityData,
      userId:auth.currentUser.uid,
      restaurantId:restaurantData.restaurant_id
    }
    const headers = {
      "Content-type": "application/json",
  };
  const resData = await axios.post(
      `https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/availability`,bodyData,
      { headers }
  );
  console.log(resData);
  window.location.reload(); 
  }
  useEffect(() => {
    async function fetchRestuarantDetail() {
      const headers = {
        "Content-type": "application/json",
      };
      const resData = await axios.get(
        `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=${restaurant_id}`,
        { headers }
      );
      console.log(resData);
      const resJsonData = JSON.parse(resData.data.body);
      setRestaurantData(resJsonData.Item);
      console.log(resJsonData.Item);
      sessionStorage.setItem("restaurant_id", resJsonData.Item.restaurant_id);
    }
    fetchRestuarantDetail();
  }, []);

  return (
    <div className="restaurant-details">
  <h1>{restaurantData.restaurant_name}</h1>
  <div>
    <strong>Address:</strong> {restaurantData.address}
  </div>
  <div>
    {restaurantData.is_open ? (
      <>
        <strong>Open</strong>
      </>
    ) : (
      <>
        <strong>Closed</strong>
      </>
    )}
  </div>
  <div className="images">
    {restaurantData.images.map((image, index) => (
      <img src={image} alt={`Restaurant Image ${index}`} key={index} />
    ))}
  </div>
  <div>
    <h2>Menu</h2>
    <Button onClick={openMenuPopup}>Add Menu</Button>
    {isAddMenuPopupOpen&&(
      <CreateMenuPopup
      isOpen={isAddMenuPopupOpen}
      onClose={closeAddMenuPopup}
      onCreateMenu={handleMenuChange}/>
    )}

  </div>
  {restaurantData.menu && restaurantData.menu.length > 0 && (
    <div>
      
      <ul>
        {restaurantData.menu.map((item, index) => (
          <li key={index}>
            <div className="menu-item">
              <img src={item.image} alt={`Menu Item Image ${index}`} />
            </div>
            <div>{item.name}</div>
            <div>{item.price}</div>
            <div>
              <Button onClick={()=>openAddMenuOfferPopup(item.name)}>Add Menu Offer</Button>
              
              {
                isAddMenuOfferPopupOpen&&(
                  <AddMenuOfferPopup
                isOpen={isAddMenuOfferPopupOpen}
                onClose={closeAddMenuOfferPopup}
                onAddMenuOffer={handleAddMenuOfferPopup}/>
                )
              }
              
            </div>
            <div>
              <Button onClick={()=>openUpdateMenuAvailabilityPopup(item.name)}>Update Menu Availability</Button>
              {
                isUpdateMenuAvailabilityPopupOpen && (
                  <UpdateMenuAvailabilityPopup
                isOpen={isUpdateMenuAvailabilityPopupOpen}
                onClose={closeUpdateMenuAvailabilityPopup}
                onUpdateMenuAvailability={handleUpdateMenuAvailability}/>
                )
              }
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}

<div>
      <h2>Restaurant Offer</h2>
      <Button onClick={openAddRestaurantOfferPopup}>Add Restaurant Offer</Button>
      {
        isAddRestaurantOfferPopupOpen&&(
          <AddRestaurantOfferPopup
          isOpen={isAddRestaurantOfferPopupOpen}
          onClose={closeAddRestaurantOfferPopup}
          onAddRestaurantOffer={handleAddRestaurantOffer}/>
        )
      }
        
  </div>
  {restaurantData.restaurant_offer ? (
      <div>{restaurantData.restaurant_offer}</div>
  ):(<div>
    <h4>"There are no current offers now."</h4>
  </div>)}

  <div>
  <h2>Restaurant Reviews</h2>
  </div>
  {restaurantData.restaurant_reviews && restaurantData.restaurant_reviews.length > 0 && (
    <div>
      
      <ul>
        {restaurantData.restaurant_reviews.map((review, index) => (
          <li key={index}>
            <div>Rating: {review.rating}</div>
            <div>{review.review}</div>
          </li>
        ))}
      </ul>
      
    </div>
  )}

      {restaurantData.tables &&
        restaurantData.tables.length > 0 && (
          <div>
            <h2>Tables</h2>
            <ul>
              {restaurantData.tables.map((table, index) => (
                <li key={index}>
                  <div>Table {table.number}</div>
                  <div>Size: {table.size}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      <div>
      <Button onClick={openAddTablePopup}>Add Table</Button>
      {
        isAddTablePopupOpen&&(
          <AddTablesPopup
          isOpen={isAddTablePopupOpen}
          onClose={closeAddTablePopup}
          onCreateTable={handleTableChange}/>
        )
      }
        
  </div>
      {restaurantData.timings && (
        <div>
          <h2>Timings</h2>
          <div>
            Monday: {restaurantData.timings.monday.opening_time} -{" "}
            {restaurantData.timings.monday.closing_time}
          </div>
          <div>
            Tuesday: {restaurantData.timings.tuesday.opening_time} -{" "}
            {restaurantData.timings.tuesday.closing_time}
          </div>
          <div>
            wednesday: {restaurantData.timings.wednesday.opening_time} -{" "}
            {restaurantData.timings.wednesday.closing_time}
          </div>
          <div>
            Thursday: {restaurantData.timings.thursday.opening_time} -{" "}
            {restaurantData.timings.thursday.closing_time}
          </div>
          <div>
            Friday: {restaurantData.timings.friday.opening_time} -{" "}
            {restaurantData.timings.friday.closing_time}
          </div>
          <div>
            saturday: {restaurantData.timings.saturday.opening_time} -{" "}
            {restaurantData.timings.saturday.closing_time}
          </div>
          <div>
            Sunday: {restaurantData.timings.sunday.opening_time} -{" "}
            {restaurantData.timings.sunday.closing_time}
          </div>
        </div>
      )}
      <div>
      <Button onClick={openChangeAvailabilityPopup}>update Timing</Button>
      {
        isChangeAvailabilityPopupOpen&&(
          <ChangeAvailabilityPopup
          isOpen={isChangeAvailabilityPopupOpen}
          onClose={closeChangeAvailabilityPopup}
          onChangeAvailability={handleChangeAvailability}/>
        )
      }
        
  </div>
    </div>
  );
}
export default RestaurantDetails;
