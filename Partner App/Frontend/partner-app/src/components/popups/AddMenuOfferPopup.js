import React, { useState } from 'react';
import {Button} from 'antd'; // Import your Button component
import './../../popup.css';

const AddMenuOfferPopup = ({ isOpen, onClose, onAddMenuOffer }) => {
  const [menuOffer,setMenuOffer]=useState();

  const handleAddMenuOffer = () => {
    // Convert menuImage to base64 before passing to the parent component

    // Pass the menuData to the parent component
    onAddMenuOffer(menuOffer);

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
            Menu Offer:
            <input type="number" value={menuOffer} onChange={(e) => setMenuOffer(e.target.value)} />
          </label>
        </div>

        {/* Add your form elements or additional content here */}
        <Button onClick={handleAddMenuOffer}>Add Menu Offer</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddMenuOfferPopup;
