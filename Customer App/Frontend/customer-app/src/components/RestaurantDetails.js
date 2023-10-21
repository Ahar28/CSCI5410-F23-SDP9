import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../RestaurantDetails.css'
import { Button } from 'antd';
function RestaurantDetails (){
    const navigate=useNavigate();
    const [restaurantData,setRestaurantData]=useState({
        restaurantName:'indian cuisine',
        address:"100, This street, Halifax, NS A1B 2C3",
        images:["https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg"],
        isOpen:true,
        menu:[
            {
                image:"https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
                isAvailable:true,
                menuReviewOverall:{
                    totalRatingCounts:2,
                    totalRatingValues:8
                },
                itemName:'Starter',
                percentOffer:10,
                price:12.99,
                reviews:[
                    {
                        rating:4,
                        review:"good taste",
                        user_id:1
                    },
                    {
                        rating:4,
                        review:"should try atleast once",
                        user_id:2
                    }
                ]
            },
            {
                image:"https://sdp9restimages.s3.amazonaws.com/Effective-Strategies-To-Improve-Your-Restaurant-Service-And-Provide-A-Stellar-Guest-Experience.jpg",
                isAvailable:true,
                menuReviewOverall:{
                    totalRatingCounts:1,
                    totalRatingValues:5
                },
                itemName:'Shahi Paneer',
                percentOffer:5,
                price:18.99,
                reviews:[
                    {
                        rating:5,
                        review:"good taste",
                        user_id:1
                    }
                ]
            }
        ],
        restaurantOffer:'up to 10% off',
        restaurantReviews:[
            {
                rating:5,
                review:'good Restaurant',
                user_id:1
            },
            {
                rating:4,
                review:'good atmosphere',
                user_id:2
            }
        ],
        restaurantReviewOverall:{
            totalRatingCounts:2,
            totalRatingValues:9
        },
        tables:[
            {
                number:1,
                size:6
            },
            {
                number:2,
                size:4
            }
        ],
        timings:{
            monday:{
                openingTime:1100,
                closingTime:2200
            },
            tuesday:{
                openingTime:1100,
                closingTime:2200
            },
            wednesday:{
                openingTime:1100,
                closingTime:2200
            },
            thursday:{
                openingTime:1100,
                closingTime:2200
            },
            friday:{
                openingTime:1100,
                closingTime:2200
            },
            saturday:{
                openingTime:1100,
                closingTime:2200
            },
            sunday:{
                openingTime:1100,
                closingTime:2200
            }
        }
    })
    useEffect=()=>{

    }
    const handleReserveClick=()=>{
        navigate('/')//add reservation page name
    }
    return(<div className='restaurant-details'>
        <h1>{restaurantData.restaurantName}</h1>
      <div>
        <strong>Address:</strong> {restaurantData.address}
      </div>
      <div> {restaurantData.isOpen ? <strong>Open</strong> : <strong>Closed</strong>}
      </div>
      <div className='images'>
        {restaurantData.images.map((image, index) => (
          <img src={image} alt={`Restaurant Image ${index}`} key={index} />
        ))}
      </div>
      <h2>Menu</h2>
      <ul>
        {restaurantData.menu.map((item, index) => (
          <li key={index}>
            <div className='menu-item'>
              <img src={item.image} alt={`Menu Item Image ${index}`} />
            </div>
            <div>{item.itemName}</div>
            <div>{item.price}</div>
          </li>
        ))}
      </ul>

      <h2>Restaurant Offer</h2>
      <div>{restaurantData.restaurantOffer}</div>

      <h2>Restaurant Reviews</h2>
      <ul>
        {restaurantData.restaurantReviews.map((review, index) => (
          <li key={index}>
            <div>Rating: {review.rating}</div>
            <div>{review.review}</div>
          </li>
        ))}
      </ul>

      <h2>Tables</h2>
      <ul>
        {restaurantData.tables.map((table, index) => (
          <li key={index}>
            <div>Table {table.number}</div>
            <div>Size: {table.size}</div>
          </li>
        ))}
      </ul>

      <h2>Timings</h2>
      <div>Monday:    {restaurantData.timings.monday.openingTime}    - {restaurantData.timings.monday.closingTime}</div>
      <div>Tuesday:   {restaurantData.timings.tuesday.openingTime}   - {restaurantData.timings.tuesday.closingTime}</div>
      <div>wednesday: {restaurantData.timings.wednesday.openingTime} - {restaurantData.timings.wednesday.closingTime}</div>
      <div>Thursday:  {restaurantData.timings.thursday.openingTime}  - {restaurantData.timings.thursday.closingTime}</div>
      <div>Friday:    {restaurantData.timings.friday.openingTime}    - {restaurantData.timings.friday.closingTime}</div>
      <div>saturday:  {restaurantData.timings.saturday.openingTime}  - {restaurantData.timings.saturday.closingTime}</div>
      <div>Sunday:    {restaurantData.timings.sunday.openingTime}    - {restaurantData.timings.sunday.closingTime}</div>

      <Button onClick={handleReserveClick}>Reserve</Button>
    </div>);
}
export default RestaurantDetails;