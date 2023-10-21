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
  apiKey: "AIzaSyCH2_Nc7sEHZoRsaHESUc32lpe9QFq5SeU",
  authDomain: "serverless-term-assignment.firebaseapp.com",
  projectId: "serverless-term-assignment",
  storageBucket: "serverless-term-assignment.appspot.com",
  messagingSenderId: "507563751363",
  appId: "1:507563751363:web:4ade233c12324f0c556f76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();