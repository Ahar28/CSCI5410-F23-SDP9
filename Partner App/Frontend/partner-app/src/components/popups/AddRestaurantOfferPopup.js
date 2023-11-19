import React, { useState } from 'react';
import {Button} from 'antd'; // Import your Button component
import './../../popup.css';

const AddRestaurantOfferPopup = ({ isOpen, onClose, onAddRestaurantOffer }) => {
  const [restaurantOffer,setRestaurantOffer]=useState('');

  const handleAddRestaurantOffer = () => {
    // Convert menuImage to base64 before passing to the parent component

    // Pass the menuData to the parent component
    onAddRestaurantOffer(restaurantOffer);

    // Close the popup after the action is complete
    onClose();
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2>Add Menu Offer</h2>
        
        {/* Form fields */}
        

        <div>
          <label>
            Restaurant Offer:
            <input type="text" value={restaurantOffer} onChange={(e) => setRestaurantOffer(e.target.value)} />
          </label>
        </div>

        {/* Add your form elements or additional content here */}
        <Button onClick={handleAddRestaurantOffer}>Add Restaurant Offer</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddRestaurantOfferPopup;
