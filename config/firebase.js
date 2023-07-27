import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA2SQb1R_UYi8FkoKwHU5ty3VLZebU0M1g",
  authDomain: "image-caption-generator-bf71d.firebaseapp.com",
  projectId: "image-caption-generator-bf71d",
  storageBucket: "image-caption-generator-bf71d.appspot.com",
  messagingSenderId: "945401242849",
  appId: "1:945401242849:web:9c5e8edea5161d03cc03a0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
