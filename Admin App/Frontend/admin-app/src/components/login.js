// Import modules and functions
import React from 'react';
import { useNavigate} from 'react-router-dom';
import { Form, Input, Button } from 'antd';


// Login function
// elements from 
// [1] “Create a Login Page,” SST. 
// https://sst.dev/chapters/create-a-login-page.html (accessed Nov. 29, 2023).
function Login() {
  
  // navigate variable to use for BrowserRouter
  const navigate = useNavigate();

  // function used if login done through Email and Password
  const handleIdPasswordLogin = (values) => {
    
    const { id, password } = values;
    
    try {
      // Check if provided credentials match admin credentials
      if (id === 'admin' && password === 'admin123') {
        // Redirect to restaurantList Page
        navigate('/home');
      } else {
        // Raise alert for wrong credentials
        alert('Wrong credentials');
      }
    } catch (error) {
      // Log and alert error
      console.error('Error logging in with id/password:', error);
      alert('Login Failed.' + error);
    }
  };

  
  // frontend elements
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '50%' }}>
        <center>
          <h1>Admin App</h1>
          <h3>Login Form</h3>
        </center>
        <Form
          name="loginForm"
          onFinish={handleIdPasswordLogin}
        >
          <Form.Item
            name="id"
            label="id"
            rules={[
              {
                required: true,
                message: 'Please enter your id',
              },
            ]}
          >
            <Input />
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
      </div>
    </div>
  );
}

export default Login;
