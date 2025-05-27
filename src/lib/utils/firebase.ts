// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk1eOqZ_3HNjven-oB70uAGfjUhydnWsQ",
  authDomain: "hotel-d59d2.firebaseapp.com",
  projectId: "hotel-d59d2",
  storageBucket: "hotel-d59d2.firebasestorage.app",
  messagingSenderId: "647782954121",
  appId: "1:647782954121:web:dd241bdfde4ed890f60258"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

connectAuthEmulator(auth, "http://localhost:9099");

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

