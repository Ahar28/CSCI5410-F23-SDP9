// Import modules and functions
import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate} from 'react-router-dom';
import { Button } from 'antd';



// Home Page function
// elements from 
// [2] “Get started with embedding Looker,” developers.looker.com.
// https://developers.looker.com/embed/getting-started/ (accessed Nov. 29, 2023).
function HomePage() {
  
  // navigate variable to use for BrowserRouter
  const navigate = useNavigate();
  
  // Sign Out function
  const handleSignOut = async () => {
    
    try {
      // Redirect to the login page after signing out
      navigate('/'); 
    } catch (error) {
      // Log error
      console.error('Error signing out:', error);
      alert('Sign out error')
    }
  };

  // Frontend elements
  return (
    <div>
      <div style={{ float: 'right', padding: '10px'  }}>
        <Button icon={<LogoutOutlined />} onClick={handleSignOut}>Sign Out</Button> 
      </div>

      <div>
        <h1>Admin panel</h1>
      </div>
      
      
      <div style={{display:'flex', flexDirection:'row'}}>
        
        <div style={{width:'700px'}}>
          <h2>Top 10 Restaurants</h2>
          <iframe src="https://lookerstudio.google.com/embed/reporting/fe4b8aa0-6401-4964-bd80-c529f5dade66/page/6YbjD" width="600" height="475"></iframe>
        </div>

        <div style={{width:'700px'}}>
          <h2>Top 10 Food Items</h2>
          <iframe src="https://lookerstudio.google.com/embed/reporting/f168e817-435b-477b-bf14-f99d3e75af44/page/lqFjD" width="600" height="475"></iframe>
        </div>

      </div>

      <div style={{display:'flex', flexDirection:'row'}}>
        
        <div style={{width:'700px'}}>
          <h2>Top 10 Order Periods</h2>
          <iframe src="https://lookerstudio.google.com/embed/reporting/1367921f-dc44-4599-820b-37bc9656e6a2/page/ibejD" width="600" height="475"></iframe>
        </div>

        <div style={{width:'700px'}}>
          <h2>Top 10 Customers</h2>
          <iframe src="https://lookerstudio.google.com/embed/reporting/bf20508f-f02d-4685-ae38-ae05c2fb3bcd/page/pjejD" width="600" height="475"></iframe>
        </div>

      </div>

      <h2>Reviews</h2>
      <iframe src="https://lookerstudio.google.com/embed/reporting/47ebd8e3-fff8-4813-805e-17735f0793d2/page/AsejD" width="100%" height="500"></iframe>

    </div>
  );
}

export default HomePage;