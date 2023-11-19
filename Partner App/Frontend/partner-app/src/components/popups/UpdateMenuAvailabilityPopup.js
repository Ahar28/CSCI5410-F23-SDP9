import React, { useState } from 'react';
import {Button} from 'antd'; // Import your Button component
import './../../popup.css';

const UpdateMenuAvailabilityPopup = ({ isOpen, onClose, onUpdateMenuAvailability }) => {
  const [menuAvailability,setMenuAvailability]=useState();

  const hanldeMenuAvailabilityUpdate = () => {
    // Convert menuImage to base64 before passing to the parent component

    // Pass the menuData to the parent component
    onUpdateMenuAvailability(menuAvailability);

    // Close the popup after the action is complete
    onClose();
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2>Add Menu Availability</h2>
        
        {/* Form fields */}
        

        <div>
          <label>
            Is Available:
            <input
              type="checkbox"
              checked={menuAvailability}
              onChange={() => setMenuAvailability(!menuAvailability)}
            />
          </label>
        </div>

        {/* Add your form elements or additional content here */}
        <Button onClick={hanldeMenuAvailabilityUpdate}>Add Menu Offer</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default UpdateMenuAvailabilityPopup;
