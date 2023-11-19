import React, { useState } from 'react';
import {Button} from 'antd'; // Import your Button component
import axios from 'axios';
import './../../popup.css';

const ChangeAvailabilityPopup = ({ isOpen, onClose, onChangeAvailability }) => {
  
  const [openingTimeStr,setOpeningTime]=useState('');
  const [closingTimeStr,setClosingTime]=useState('');
  const convertTo4DigitFormat = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return parseInt(hours + minutes, 10);
  };
  const handleAvailabilityChange = () => {
    const openingTime = convertTo4DigitFormat(openingTimeStr);
    const closingTime = convertTo4DigitFormat(closingTimeStr);
    let availabilityData= {
      openingTime,
      closingTime
    }
    onChangeAvailability(availabilityData);
    onClose();
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2>Change Availability</h2>
        
        {/* Radio button for availability */}
        <div>
        <label>
        Opening Time:
        <input
          type="time"
          value={openingTimeStr}
          onChange={(e) => setOpeningTime(e.target.value)}
        />
      </label>
      <label>
        Closing Time:
        <input
          type="time"
          value={closingTimeStr}
          onChange={(e) => setClosingTime(e.target.value)}
        />
      </label>
        </div>

        {/* Add your form elements or additional content here */}
        <Button onClick={handleAvailabilityChange}>Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default ChangeAvailabilityPopup;

