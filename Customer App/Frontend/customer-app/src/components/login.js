// Import modules and functions
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Form, Input, Button } from "antd";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Login function
// elements from
// [1] Matheshyogeswaran, “Firebase Auth with react: Implement email/password
// and google sign-in,” Medium,
// https://blog.bitsrc.io/firebase-authentication-with-react-for-beginners-implementing-email-password-and-google-sign-in-e62d9094e22 (accessed Oct. 17, 2023).
function Login() {
  // navigate variable to use for BrowserRouter
  const navigate = useNavigate();

  const redirectToPartnerApp = () => {
    window.location.href = 'https://partner-app-dw7d62t47q-uc.a.run.app/';
  };
  
  // function used if login done through Email and Password
  const handleEmailPasswordLogin = async (values) => {
    const { email, password } = values;

    try {
      // Call in-built firebase function to log in with email and password
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userId = response?.user?.uid ?? "";
      sessionStorage.setItem("userId", userId);

      // Redirect to restaurantList Page
      navigate("/home");
    } catch (error) {
      // Log and alert error
      console.error("Error logging in with email/password:", error);
      alert("Login Failed." + error);
    }
  };

  // function used if login done through Google single sign on
  const handleGoogleSignIn = async () => {
    try {
      // Call in-built firebase function to log in with google single sign on pop up
      const response = await signInWithPopup(auth, googleProvider);
      const userId = response?.user?.uid ?? "";
      sessionStorage.setItem("userId", userId);

      // Redirect to restaurantList Page
      navigate("/home");
    } catch (error) {
      // Log and alert error
      console.error("Error logging in with Google:", error);
      alert("Login Failed." + error);
    }
  };

  // frontend elements
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "50%" }}>
        <center>
          <h1>Table Reservation App</h1>
          <h3>Login Form</h3>
        </center>
        <Form name="loginForm" onFinish={handleEmailPasswordLogin}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
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
                message: "Please enter your password!",
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
          <Button icon={<FaGoogle />} onClick={handleGoogleSignIn}>
            Login with Google
          </Button>
          <br />
          Don't have an account? <Link to="/signup">Sign up</Link>
          <br /> <br />
          <Button onClick={redirectToPartnerApp}>
            Go to Partner App
          </Button>
        </center>
      </div>
    </div>
  );
}

export default Login;
