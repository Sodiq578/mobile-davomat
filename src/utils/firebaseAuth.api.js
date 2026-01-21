// src/api/firebaseAuth.api.js
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile as firebaseUpdateProfile  // updateProfile ni import qilish
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { localLogin, localRegister, checkLocalUsers } from "../utils/authBackup";

// Firebase bilan login (agar Firebase ishlamasa, local bilan)
export const loginWithEmail = async (email, password) => {
  try {
    // Avval Firebase bilan urinib ko'rish
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName || userData?.name || "User",
        role: userData?.role || "employee",
        avatar: user.photoURL || userData?.avatar || null,
        position: userData?.position || null,
        department: userData?.department || null
      },
      token: await user.getIdToken(),
      source: 'firebase'
    };
  } catch (firebaseError) {
    console.warn('Firebase login failed, trying local:', firebaseError.message);
    
    // Agar Firebase ishlamasa, Local Storage bilan login qilish
    return localLogin(email, password);
  }
};

// Google login (backup bilan)
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Google User",
        role: "employee",
        avatar: user.photoURL || null,
        position: "",
        department: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      });
    }
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Google User",
        role: userDoc.data()?.role || "employee",
        avatar: user.photoURL,
        position: userDoc.data()?.position || "",
        department: userDoc.data()?.department || ""
      },
      token: await user.getIdToken(),
      source: 'firebase'
    };
  } catch (error) {
    console.warn('Google login failed:', error.message);
    
    // Google ishlamasa, demo hisob bilan login qilish
    return localLogin('employee@hr.com', '123456');
  }
};

// Ro'yxatdan o'tish (backup bilan)
export const registerWithEmail = async (userData) => {
  try {
    const { email, password, name, role = "employee", position, department } = userData;
    
    // Firebase bilan urinib ko'rish
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // User profile ni yangilash
    await firebaseUpdateProfile(user, {
      displayName: name
    });
    
    // Firestore ga saqlash
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: name,
      role: role,
      position: position || "",
      department: department || "",
      avatar: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    });
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: name,
        role: role,
        avatar: null,
        position: position,
        department: department
      },
      token: await user.getIdToken(),
      source: 'firebase'
    };
  } catch (firebaseError) {
    console.warn('Firebase register failed, using local:', firebaseError.message);
    
    // Agar Firebase ishlamasa, Local Storage bilan ro'yxatdan o'tish
    return localRegister(userData);
  }
};

// Demo hisoblarni yaratish
export const initDemoAccounts = () => {
  return checkLocalUsers();
};

// Check if Firebase is available
export const isFirebaseAvailable = () => {
  return !!(auth && db);
};

// Token olish
export const getAuthToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return localStorage.getItem('auth_token') || null;
  } catch (error) {
    console.warn('Get auth token error:', error);
    return null;
  }
};

// Logout qilish
export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.warn('Firebase logout error:', error);
  } finally {
    // Local Storage ni ham tozalash
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_source');
  }
};

// Joriy user ni olish
export const getCurrentUser = () => {
  try {
    const user = auth.currentUser;
    if (user) {
      return user;
    }
    
    // Agar Firebase user yo'q bo'lsa, localStorage dan olish
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    
    return null;
  } catch (error) {
    console.warn('Get current user error:', error);
    return null;
  }
};