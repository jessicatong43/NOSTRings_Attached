// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCNG2w_FNDoGeLZrErGRoml42NlvYGdcOE',
  authDomain: 'nostringsattached-a3050.firebaseapp.com',
  projectId: 'nostringsattached-a3050',
  storageBucket: 'nostringsattached-a3050.appspot.com',
  messagingSenderId: '121034779757',
  appId: '1:121034779757:web:7341dcacd0865ce9232364',
  measurementId: 'G-77CCX8QN6S',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
