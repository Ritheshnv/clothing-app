import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCRt5WU4FAsQx8h0DuI5z2TYHbrOZEYfEo",
  authDomain: "dihana-couture.firebaseapp.com",
  databaseURL: "https://dihana-couture-default-rtdb.firebaseio.com",
  projectId: "dihana-couture",
  storageBucket: "dihana-couture.firebasestorage.app",
  messagingSenderId: "691555505753",
  appId: "1:691555505753:web:6e15d2f37bc9d5680c4348",
  measurementId: "G-KVC95Q4QS3"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;
    
    try {
        const userRef = firestore.doc(`users/${userAuth.uid}`);
        const snapshot = await userRef.get();

        if (!snapshot.exists) {
            const { displayName, email } = userAuth;
            const createdAt = new Date();

            try {
                await userRef.set({
                    displayName,
                    email,
                    createdAt,
                    ...additionalData
                })
            } catch (error) {
                console.log('error while storing user', error.message);
            }
        }
        return userRef;
    } catch (error) {
        console.log('Firebase permissions error:', error.message);
        return null;
    }
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Enable offline persistence
try {
    firestore.enablePersistence({ synchronizeTabs: true });
} catch (err) {
    if (err.code === 'failed-precondition') {
        console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.log('The current browser does not support all of the features required to enable persistence');
    }
}

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => {
    console.log('Attempting Google Sign-In...');
    return auth.signInWithPopup(provider)
        .then(result => {
            console.log('Google Sign-In successful:', result.user);
            return result;
        })
        .catch(error => {
            console.error('Google Sign-In error:', error);
            throw error;
        });
};

// Email/Password authentication methods
export const createUserWithEmailAndPassword = (email, password) => 
    auth.createUserWithEmailAndPassword(email, password);

export const signInWithEmailAndPassword = (email, password) => 
    auth.signInWithEmailAndPassword(email, password);

// Update user profile
export const updateUserProfile = async (userId, updateData) => {
    try {
        console.log('Updating user profile for userId:', userId);
        console.log('Update data:', updateData);
        
        const userRef = firestore.doc(`users/${userId}`);
        
        // Check if document exists first
        const snapshot = await userRef.get({ source: 'cache' }).catch(() => 
            userRef.get({ source: 'server' })
        );
        
        if (!snapshot.exists) {
            console.log('User document does not exist, creating new one');
            await userRef.set(updateData);
        } else {
            console.log('User document exists, updating');
            await userRef.update(updateData);
        }
        
        console.log('Profile update successful');
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Handle offline errors
        if (error.code === 'unavailable' || error.message.includes('offline')) {
            throw new Error('You are currently offline. Please check your internet connection and try again.');
        }
        
        return false;
    }
};

export default firebase;
