// src/firebase.js
// Firebase 9+ versiyasida modular import ishlatiladi

// Firebase Core
import { initializeApp } from "firebase/app";

// Authentication services
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged
} from "firebase/auth";

// Firestore Database
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";

// Firebase konfiguratsiyasi - o'zingizning ma'lumotlaringizni qo'ying
const firebaseConfig = {
  apiKey: "AIzaSyA1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
  authDomain: "trackio-pro.firebaseapp.com",
  projectId: "trackio-pro",
  storageBucket: "trackio-pro.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Firebase app ni initialize qilish
const app = initializeApp(firebaseConfig);

// Authentication ni olish
export const auth = getAuth(app);

// Firestore database ni olish
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth state observer (real-time user tracking)
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// User ma'lumotlarini Firestore ga saqlash
export const saveUserToFirestore = async (user, additionalData = {}) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.fullName || '',
        photoURL: user.photoURL || '',
        phoneNumber: additionalData.phone || '',
        role: additionalData.role || 'employee',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...additionalData
      });
    }
    return true;
  } catch (error) {
    console.error("Firestore ga saqlashda xato:", error);
    throw error;
  }
};

// Google bilan login
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Firestore ga user ma'lumotlarini saqlash
    await saveUserToFirestore(user, {
      role: 'employee'
    });
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        avatar: user.displayName?.charAt(0)?.toUpperCase() || 'U',
        photoURL: user.photoURL,
        role: 'employee'
      },
      token: await user.getIdToken()
    };
  } catch (error) {
    console.error("Google login xatosi:", error);
    throw error;
  }
};

// Email/Password bilan login
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Email login xatosi:", error);
    throw error;
  }
};

// Email/Password bilan ro'yxatdan o'tish
export const createUserWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Register xatosi:", error);
    throw error;
  }
};

// User profile ni yangilash
export const updateProfile = async (user, profileData) => {
  try {
    await firebaseUpdateProfile(user, profileData);
  } catch (error) {
    console.error("Profile update xatosi:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout xatosi:", error);
    throw error;
  }
};

// Token olish
export const getIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error("Token olish xatosi:", error);
    throw error;
  }
};

// User ID ga qarab role olish
export const getUserRole = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data().role || 'employee';
    }
    return 'employee';
  } catch (error) {
    console.error("Role olish xatosi:", error);
    return 'employee';
  }
};

// User ma'lumotlarini olish
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    }
    return null;
  } catch (error) {
    console.error("User ma'lumotlarini olish xatosi:", error);
    return null;
  }
};

export default app;