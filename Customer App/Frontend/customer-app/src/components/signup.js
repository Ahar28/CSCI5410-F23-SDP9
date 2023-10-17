// Signup.js
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'
import { Form, Input, Button } from 'antd';
import { auth , googleProvider} from "../config/firebase";
import {createUserWithEmailAndPassword,signInWithPopup} from 'firebase/auth';

function Signup() {
  const navigate = useNavigate();

  const handleSignUpEmailPassword = async (values) => {
    const { email, password } = values;
    try {
      await createUserWithEmailAndPassword(auth,email, password);
      // Redirect to a protected route or do something else upon successful sign-up
      navigate('/home');
    } catch (error) {
      console.error('Error signing up with email/password:', error);
      alert(error)
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth,googleProvider);
      // Redirect to a protected route or do something else upon successful sign-up
      navigate('/home');
    } catch (error) {
      console.error('Error signing up with Google:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '50%' }}>
        <center>
          <h1>Table Reservation App</h1>
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
