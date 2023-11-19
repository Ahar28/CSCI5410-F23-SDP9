import React, { useState } from 'react';
import {Button} from 'antd'; // Import your Button component
import './../../popup.css';

const CreateMenuPopup = ({ isOpen, onClose, onCreateMenu }) => {
  const [menuName, setMenuName] = useState('');
  const [menuImage, setMenuImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true); // Default to true
  const [price, setPrice] = useState();

  const handleMenuImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setMenuImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCreateMenu = () => {
    // Convert menuImage to base64 before passing to the parent component
    const menuData = {
      menuName,
      menuImage,
      isAvailable,
      price,
    };

    // Pass the menuData to the parent component
    onCreateMenu(menuData);

    // Close the popup after the action is complete
    onClose();
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2>Create Menu</h2>
        
        {/* Form fields */}
        <div>
          <label>
            Menu Name:
            <input type="text" value={menuName} onChange={(e) => setMenuName(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Menu Image:
            <input type="file" accept="image/*" onChange={handleMenuImageChange} />
          </label>
        </div>

        <div>
          <label>
            Is Available:
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={() => setIsAvailable(!isAvailable)}
            />
          </label>
        </div>

        <div>
          <label>
            Price:
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
        </div>

        {/* Add your form elements or additional content here */}
        <Button onClick={handleCreateMenu}>Create Menu</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateMenuPopup;
