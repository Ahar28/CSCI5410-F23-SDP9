// Signup.js
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUpEmailPassword = (values) => {
    console.log('Email:', values.email);
    console.log('Password:', values.password);
  };

  const handleGoogleSignUp = () => {
    
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
          <Button onClick={handleGoogleSignUp}>Login with Google</Button>
          <div>
            Already have an account? <Link to="/">Login</Link>
          </div>
        </center>
      </div>
    </div>
  );
}

export default Signup;
