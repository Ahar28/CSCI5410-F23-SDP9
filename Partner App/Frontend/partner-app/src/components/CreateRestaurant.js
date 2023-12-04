import React, { useState } from 'react';
import { Button } from 'antd';
import "./../CreateRestaurant.css";
import axios from 'axios';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const CreateRestaurant = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: '',
    base64Images: [],
    address: '',
    isOpen: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;

    // Convert each selected image to base64
    const imagesArray = Array.from(files).map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    });

    // Once all images are converted, update the state
    Promise.all(imagesArray).then((base64Images) => {
      setFormData((prevData) => ({
        ...prevData,
        base64Images: base64Images,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission, you can send formData to the server or perform other actions
        const bodyData={
            restaurantName:formData.restaurantName,
            address:formData.address,
            isOpen:formData.isOpen,
            base64Images:formData.base64Images,
            userId:auth.currentUser.uid,
            userEmail:auth.currentUser.email
        }
        const headers = {
            "Content-type": "application/json",
        };
        const resData = await axios.post(
            `https://gs6b5266pf.execute-api.us-east-1.amazonaws.com/dev/restaurant/create`,bodyData,
            { headers }
        );
        console.log(resData);
        navigate('/home'); 
  };

  return (
    <div className="container">
        <h2>Create Restaurant</h2>
    <form className='create-restaurant-form' onSubmit={handleSubmit}>
      <label>
        Restaurant Name:
        <input
          type="text"
          name="restaurantName"
          value={formData.restaurantName}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Images:
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </label>

      <label>
        Address:
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Is Open:
        <input
          type="checkbox"
          name="isOpen"
          checked={formData.isOpen}
          onChange={handleInputChange}
        />
      </label>

      <Button type="primary" onClick={handleSubmit}>
      Create Restaurant
    </Button>
    </form>
    </div>
  );
};

export default CreateRestaurant;
