// Import modules and functions
import React, { useState, useEffect } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Card } from 'antd';
import axios from 'axios';
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";
import { KOMMUNICATE_APP_ID } from '../config/kommunicate';

Kommunicate.init(KOMMUNICATE_APP_ID, {
  automaticChatOpenOnNavigation: true,
  popupWidget: true
});

const { Meta } = Card;
// Restaurant List function
// elements from 
// [1] Matheshyogeswaran, “Firebase Auth with react: Implement email/password 
// and google sign-in,” Medium, 
// https://blog.bitsrc.io/firebase-authentication-with-react-for-beginners-implementing-email-password-and-google-sign-in-e62d9094e22 (accessed Oct. 17, 2023). 
function RestaurantList() {
  // navigate variable to use for BrowserRouter
  const navigate = useNavigate();

  // User Detail variable
  const [user, setUser] = useState(null);
  const [restaurants,setRestaurants]= useState([
    {id:1,restaurant_name:'Restaurant 1',images: ['https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg']},
    {id:2,restaurant_name:'Restaurant 2',images:['https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg']},
    {id:3,restaurant_name:'Restaurant 3',images:['https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg']}
  ])

  // Function called when page is loaded, kind of like main function or init function
  useEffect(() => {
    // Use Firebase to get the currently signed-in user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set the user state
        setUser(user);
      } else {
        // No user is signed in
        setUser(null);
        //Redirect to login page
        navigate('/')
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  useEffect(()=>{
    async function fetchRestuarants (){
    const headers = {
      'Content-type':'application/json'
    }
    const resData = await axios.get("https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurants/list",{headers});
    console.log(resData)
    const resJsonData = JSON.parse(resData.data.body);
    setRestaurants(resJsonData);
  }

  async function editRestuarantsRes (){
    const headers = {
      'Content-type':'application/json'
    }
    await axios.put("https://da6qjyjjn2.execute-api.us-east-1.amazonaws.com/dev/edit-reservation",{
      "user_id": 1,
      "restaurant_id": 1,
      "no_of_people": 999,
      "reservation_id": "XcKZPeeUYbeQH5eQIQQB",
      "reservationDatePostman" : "2023-10-31 15:33:33"
    });
  }

  editRestuarantsRes()

  fetchRestuarants();
  },[])
  
  // Sign Out function
  const handleSignOut = async () => {
    
    try {
      // Firebase inbuilt function 
      await signOut(auth);

      // Redirect to the login page after signing out
      navigate('/'); 
    } catch (error) {
      // Log error
      console.error('Error signing out:', error);
      alert('Sign out error')
    }
  };
  const handleViewDetails = async (restaurant_id) =>{
    navigate(`/restaurantpage/${restaurant_id}`)
  }
  // Frontend elements
  return (
    <div>
      <div style={{ float: 'right', padding: '10px'  }}>
        <Button icon={<LogoutOutlined />} onClick={handleSignOut}>Sign Out</Button> 
      </div>

      <div>
        <h1>Restaurant List</h1>
        <ul>
          {restaurants.map((restaurant) => (
            <Card
            style={{
              width: 300,
            }}
            cover={
              <img
                alt="example"
                src={restaurant.images[0]}
              />
            }
            actions={[
              <Button type='primary' onClick={()=>handleViewDetails(restaurant.restaurant_id)}>View Details</Button>
            ]}
          >
            <Meta
              title={restaurant.restaurant_name}
            />
          </Card>
          ))}
        </ul>
        
      </div>
    </div>
  );
}

export default RestaurantList;
