// Import modules and functions
import React, { useState, useEffect } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { Card } from "antd";
import axios from "axios";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";
import { KOMMUNICATE_APP_ID, KOMMUNICATE_LOADED } from "../config/kommunicate";

const { Meta } = Card;

// Restaurant List function
function RestaurantList() {

  const navigate = useNavigate();

  // User Detail variable
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState(
  //   [
  //   {
  //     id: 1,
  //     restaurant_name: "Restaurant 1",
  //     images: [
  //       "https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     restaurant_name: "Restaurant 2",
  //     images: [
  //       "https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
  //     ],
  //   },
  //   {
  //     id: 3,
  //     restaurant_name: "Restaurant 3",
  //     images: [
  //       "https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
  //     ],
  //   },
  // ]
  );

  // Function called when page is loaded, kind of like main function or init function
  useEffect(() => {
    // Use Firebase to get the currently signed-in user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set the user state
        setUser(user);

        const isKommunicateLoaded = JSON.parse(
          sessionStorage.getItem(KOMMUNICATE_LOADED)
        );
        const Kommunicate_user_key = auth.currentUser.uid + "|" + auth.currentUser.email

        // Load Kommunicate iframe once
        if (!isKommunicateLoaded) {
          Kommunicate.init(KOMMUNICATE_APP_ID, {
            automaticChatOpenOnNavigation: true,
            popupWidget: true,
            userId: Kommunicate_user_key,
          });
          sessionStorage.setItem(KOMMUNICATE_LOADED, JSON.stringify(true));
        }
      } else {
        // No user is signed in
        setUser(null);

        //Clear Kommunicate local storage to prevent unauthorized access
        sessionStorage.removeItem(KOMMUNICATE_LOADED);

        //Redirect to login page
        navigate("/");

        //Force reload after log out to clear Kommunicate conversations
        window.location.reload();
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => { 
    async function fetchRestuarants() {
      const headers = {
        "Content-type": "application/json",
      };
      const resData = await axios.get(
        "https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurants/list",
        { headers }
      );
      console.log(resData);
      const resJsonData = JSON.parse(resData.data.body);
      setRestaurants(resJsonData);
    }


    fetchRestuarants();
  }, []);

 

  // Sign Out function
  const handleSignOut = async () => {
    try {
      // Firebase inbuilt function
      await signOut(auth);

      // Redirect to the login page after signing out
      navigate("/");
    } catch (error) {
      // Log error
      console.error("Error signing out:", error);
      alert("Sign out error");
    }
  };

  const handleViewDetails = async (restaurant_id) => {
    navigate(`/restaurantpage/${restaurant_id}`);
  };

  const handleViewReservation = async () => {
    navigate(`/view-reservations`);
  };

  // Frontend elements
  return (
    <div>
      <div style={{ float: "right", padding: "10px" }}>
        <Button icon={<LogoutOutlined />} onClick={handleSignOut}>
          Sign Out
        </Button>
        <Button onClick={handleViewReservation}>Your Reservations</Button>
      </div>

      <div>
        <h1 style={{ textAlign: "center" }}>Restaurant List</h1>
        <ul>
          {restaurants.map((restaurant) => (
            <Card
              style={{
                width: 300,
              }}
              cover={<img alt="example" src={restaurant.images[0]} />}
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleViewDetails(restaurant.restaurant_id)}
                >
                  View Details
                </Button>,
              ]}
            >
              <Meta title={restaurant.restaurant_name} />
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RestaurantList;
