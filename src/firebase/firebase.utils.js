import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDBGVHdaZM85aMV0hRea-I9TdNmmTCMPOc",
    authDomain: "v-cart-fee43.firebaseapp.com",
    databaseURL: "https://v-cart-fee43.firebaseio.com",
    projectId: "v-cart-fee43",
    storageBucket: "v-cart-fee43.appspot.com",
    messagingSenderId: "337081967063",
    appId: "1:337081967063:web:d7d57dcc7f61460f8dab92",
    measurementId: "G-BPN6QDT7GB"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
