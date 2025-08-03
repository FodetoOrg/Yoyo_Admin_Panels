// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, PhoneAuthProvider, signInWithCredential, signOut } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries





const firebaseConfig = {
  // apiKey: "AIzaSyCmLGvYlVI_uCh5kkBGy6Ra74Ep6Fc5Om0",
  // authDomain: "myapp-bba24.firebaseapp.com",
  // projectId: "myapp-bba24",
  // storageBucket: "myapp-bba24.firebasestorage.app",
  // messagingSenderId: "555333996320",
  // appId: "1:555333996320:web:60ed60c43f277cf0dd9145",
  // measurementId: "G-HDGNCNQYXK"
  apiKey: "AIzaSyDxikkqEmRMY50vSOJ9EWWMAcBR7sdMo9c",
  authDomain: "yoyolite-9b1eb.firebaseapp.com",
  projectId: "yoyolite-9b1eb",
  storageBucket: "yoyolite-9b1eb.firebasestorage.app",
  messagingSenderId: "799826704954",
  appId: "1:799826704954:web:1c5dc5107c13ff76279303",
  measurementId: "G-WDTFJ85S1W"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);




// connectAuthEmulator(auth, "http://localhost:9099");

// Setup reCAPTCHA verifier
const setupRecaptcha = (containerId = 'recaptcha-container') => {
  try {
    // Clear any existing reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
      'error-callback': (error) => {
        console.error('reCAPTCHA error:', error);
      }
    });

    // Store globally to prevent multiple instances
    window.recaptchaVerifier = recaptchaVerifier;
    return recaptchaVerifier;
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    throw error;
  }
};

export { auth, setupRecaptcha, PhoneAuthProvider, signInWithCredential };

