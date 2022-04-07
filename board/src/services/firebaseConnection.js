import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBIkULwoWy0MQBNhAaZ-1TU3UV0W535Y5s",
  authDomain: "board-b0b43.firebaseapp.com",
  databaseURL: "https://board-b0b43-default-rtdb.firebaseio.com",
  projectId: "board-b0b43",
  storageBucket: "board-b0b43.appspot.com",
  messagingSenderId: "595349752101",
  appId: "1:595349752101:web:157538a610b0b6f1a232cc",
  measurementId: "G-597C9V971L"
};

// Initialize Firebase
// Initialize Firebase
if(!firebase.apps.length){
 firebase.initializeApp(firebaseConfig);

}

export default firebase;

export function firestore() {
    throw new Error('Function not implemented.');
}
