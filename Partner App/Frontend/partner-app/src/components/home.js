// Import modules and functions
import React, { useState, useEffect } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

// Restaurant List function
// elements from 
// [1] Matheshyogeswaran, “Firebase Auth with react: Implement email/password 
// and google sign-in,” Medium, 
// https://blog.bitsrc.io/firebase-authentication-with-react-for-beginners-implementing-email-password-and-google-sign-in-e62d9094e22 (accessed Oct. 17, 2023). 
function HomePage() {
  
  // navigate variable to use for BrowserRouter
  const navigate = useNavigate();

  // User Detail variable
  const [user, setUser] = useState(null);

  // Function called when page is loaded, kind of like main function or init function
  useEffect(() => {
    // Use Firebase to get the currently signed-in user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set the user state
        setUser(user);
      } else {
        // No user is signed in
        setUser(null);
        //Redirect to login page
        navigate('/')
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  
  // Sign Out function
  const handleSignOut = async () => {
    
    try {
      // Firebase inbuilt function 
      await signOut(auth);

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
        <h1>Restaurant List</h1>
        {user && (
          <p>Welcome, {user.displayName} ({user.email})</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
