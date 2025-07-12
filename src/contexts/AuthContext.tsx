import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase'; // 🔍 Make sure db is exported from firebase.ts

interface User {
  displayName?: string | null;
  email?: string | null;
  admin?: boolean;
  mobile?: number | string;
  name?: string;
  passout_year?: number;
  reg_id?: number;
  role?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName?: string,
    extra?: {
      admin?: boolean;
      mobile?: number | string;
      name?: string;
      passout_year?: number;
      reg_id?: number;
    }
  ) => Promise<void>;
  loginWithGoogle: (extra?: {
    admin?: boolean;
    mobile?: number | string;
    name?: string;
    passout_year?: number;
    reg_id?: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// 🔍 Add this helper
const saveUserToFirestore = async (user: FirebaseUser, extra?: any) => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      role: 'user',
      createdAt: serverTimestamp(),
      admin: extra?.admin || false,
      mobile: extra?.mobile || '',
      name: extra?.name || user.displayName || '',
      passout_year: extra?.passout_year || '',
      reg_id: extra?.reg_id || '',
    });
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setCurrentUser({
            ...snap.data(),
            email: user.email,
            displayName: user.displayName,
          });
        } else {
          setCurrentUser({
            email: user.email,
            displayName: user.displayName,
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Fetch user data from Firestore
    const userRef = doc(db, 'users', result.user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      setCurrentUser({
        ...snap.data(),
        email: result.user.email,
        displayName: result.user.displayName,
      });
    } else {
      setCurrentUser({
        email: result.user.email,
        displayName: result.user.displayName,
      });
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName?: string,
    extra?: {
      admin?: boolean;
      mobile?: number | string;
      name?: string;
      passout_year?: number;
      reg_id?: number;
    }
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
      setCurrentUser({
        displayName,
        email: result.user.email,
        ...extra,
      });
    }
    await saveUserToFirestore(result.user, extra); // 🔍 Save after signup
  };

  const loginWithGoogle = async (extra?: {
    admin?: boolean;
    mobile?: number | string;
    name?: string;
    passout_year?: number;
    reg_id?: number;
  }) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await saveUserToFirestore(result.user, extra); // 🔍 Save after Google login
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
