// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth, PhoneAuthProvider, signInWithCredential, signOut } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyDTJwFGLiNYCZPNO72paRPCzo68UDbKViI",
  authDomain: "hotel-e2a0d.firebaseapp.com",
  projectId: "hotel-e2a0d",
  storageBucket: "hotel-e2a0d.firebasestorage.app",
  messagingSenderId: "51498589116",
  appId: "1:51498589116:web:c17581bd23d2ae7fc7e9b9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);




// connectAuthEmulator(auth, "http://localhost:9099");

// Setup reCAPTCHA verifier
const setupRecaptcha = (phoneNumber: string) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible',
    'callback': () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    }
  });
  return recaptchaVerifier;
};

export { auth, setupRecaptcha, PhoneAuthProvider, signInWithCredential };

