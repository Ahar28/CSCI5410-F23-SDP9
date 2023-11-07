// import modules and functions
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'
import { Form, Input, Button } from 'antd';
import { auth , googleProvider} from "../config/firebase";
import {createUserWithEmailAndPassword,signInWithPopup} from 'firebase/auth';

// Sign Up function
// elements from
// [1] Matheshyogeswaran, “Firebase Auth with react: Implement email/password 
// and google sign-in,” Medium, 
// https://blog.bitsrc.io/firebase-authentication-with-react-for-beginners-implementing-email-password-and-google-sign-in-e62d9094e22 (accessed Oct. 17, 2023). 
function Signup() {
  // navigate variable to use for BrowserRouter
  const navigate = useNavigate();

  // function used if sign up done through Email and Password
  const handleSignUpEmailPassword = async (values) => {
    
    const { email, password } = values;
    
    try {
      // Call in-built firebase function to sign up with email and password
      await createUserWithEmailAndPassword(auth,email, password);

      // Redirect to restaurantList Page
      navigate('/home');
    } catch (error) {
      // Log and alert the error
      console.error('Error signing up with email/password:', error);
      alert(error)
    }
  };

  // function used if sign up done through Google Single Sign on
  const handleGoogleSignUp = async () => {
    
    try {
      // Call in-built firebase function to log in with google single sign on pop up
      await signInWithPopup(auth,googleProvider);

      // Redirect to restaurantList Page
      navigate('/home');
    } catch (error) {
      // Log and alert the error
      console.error('Error signing up with Google:', error);
      alert('Sign Up error' + error);
    }
  };

  // Frontend elements
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '50%' }}>
        <center>
          <h1>Partner App</h1>
          <h3>Sign Up Form</h3>
        </center>
        <Form
          name="signUpForm"
          onFinish={handleSignUpEmailPassword}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please enter your email!',
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <center>
              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </center>
          </Form.Item>
        </Form>
        <center>
          <Button icon={<FaGoogle />} onClick={handleGoogleSignUp}>Login with Google</Button>
          <div>
            Already have an account? <Link to="/">Login</Link>
          </div>
        </center>
      </div>
    </div>
  );
}

export default Signup;
