import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBjd48zvRFZFBZ0BDTprLVrAVdTq_yx0ZU',
  authDomain: 'realsand-ng.firebaseapp.com',
  projectId: 'realsand-ng',
  storageBucket: 'realsand-ng.appspot.com',
  messagingSenderId: '441221300888',
  appId: '1:441221300888:web:116c43c57b8880635b06ed',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { db, auth };
