// Signup.js
import React, { useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function RestaurantList() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the login page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <div style={{ float: 'right', padding: '10px'  }}>
        <Button icon={<LogoutOutlined />} onClick={handleSignOut}>Sign Out</Button> 
      </div>

      <div>
        <h1>Restaurant List</h1>
      </div>
    </div>
  );
}

export default RestaurantList;
