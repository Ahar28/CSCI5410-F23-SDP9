// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries


// Referenced
// [1] Matheshyogeswaran, “Firebase Auth with react: Implement email/password 
// and google sign-in,” Medium, 
// https://blog.bitsrc.io/firebase-authentication-with-react-for-beginners-implementing-email-password-and-google-sign-in-e62d9094e22 (accessed Oct. 17, 2023). 

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDW9ZDQ9eWq0CTRo5KkyM4nQUx6eDiouFo",
  authDomain: "serverless-partner.firebaseapp.com",
  projectId: "serverless-partner",
  storageBucket: "serverless-partner.appspot.com",
  messagingSenderId: "270500578312",
  appId: "1:270500578312:web:787adc06b2ab8b2458bdbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();