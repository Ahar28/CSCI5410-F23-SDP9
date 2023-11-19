import React, { useState } from 'react';
import {Button} from 'antd'; // Import your Button component
import './../../popup.css';

const AddTablesPopup = ({ isOpen, onClose, onCreateTable }) => {
  const [tableNumber, setTableNumber] = useState();
  const [tableSize, setTableSize] = useState();

  const handleCreateTable = () => {
    // Convert menuImage to base64 before passing to the parent component
    const tableData = {
      tableNumber,
      tableSize
    };

    // Pass the menuData to the parent component
    onCreateTable(tableData);

    // Close the popup after the action is complete
    onClose();
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2>Create Table</h2>
        
        {/* Form fields */}
        <div>
          <label>
            Table Number:
            <input type="number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Table Size:
            <input type="number" value={tableSize} onChange={(e) => setTableSize(e.target.value)} />
          </label>
        </div>

        {/* Add your form elements or additional content here */}
        <Button onClick={handleCreateTable}>Create Table</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddTablesPopup;
