// Login.js
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailPasswordLogin = (values) => {
    console.log('Email:', values.email);
    console.log('Password:', values.password);
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in here
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '50%' }}>
        <center>
          <h1>Table Reservation App</h1>
          <h3>Login Form</h3>
        </center>
        <Form
          name="loginForm"
          onFinish={handleEmailPasswordLogin}
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
                Login
              </Button>
            </center>
          </Form.Item>
        </Form>
        <center>
          <Button onClick={handleGoogleSignIn}>Login with Google</Button> <br />
          
          Don't have an account? <Link to="/signup">Sign up</Link>
        </center>
      </div>
    </div>
  );
}

export default Login;
