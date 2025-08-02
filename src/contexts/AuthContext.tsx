import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { type ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { type AuthProviderProps, type User, type AuthContextType } from '../types';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 🔍 Add this helper
const saveUserToFirestore = async (user: FirebaseUser, extra?: any) => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  // Prefer extra.name, then user.displayName, then ''
  const name = extra?.name || user.displayName || '';
  const photo = extra?.photo || user.photoURL || '';
  const email = extra?.email || user.email || '';
  // You can add more Google user fields here if needed
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email,
      role: extra?.role || 'user',
      createdAt: serverTimestamp(),
      reg_id: extra?.reg_id || '',
      name,
      passout_year: extra?.passout_year || '',
      photo,
      password: extra?.password || '',
      // Contact map
      contact: {
        phone: extra?.contact?.phone || extra?.mobile || '',
        whatsapp: extra?.contact?.whatsapp || '',
      },
      // Address map
      address: {
        present: extra?.address?.present || '',
        permanent: extra?.address?.permanent || '',
      },
      // Parent map
      parent: {
        father: extra?.parent?.father || '',
        mother: extra?.parent?.mother || '',
      },
      // Profession map
      profession: {
        company: extra?.profession?.company || '',
        position: extra?.profession?.position || '',
        working: typeof extra?.profession?.working === 'boolean' ? extra.profession.working : false,
      },
      // Education map
      education: {
        qualification: extra?.education?.qualification || '',
        mission: extra?.education?.mission || '',
      },
      // Info map (can be extended)
      info: extra?.info || {},
      admin: extra?.admin || false,
      // Add any other Google user fields you want to store
      provider: user.providerId || 'password',
      emailVerified: user.emailVerified || false,
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
          });
        } else {
          setCurrentUser({
            email: user.email,
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
      });
    } else {
      setCurrentUser({
        email: result.user.email,
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
    // If displayName is provided and no extra.name, use it
    const mergedExtra = { ...extra };
    if (displayName && !mergedExtra.name) mergedExtra.name = displayName;
    await saveUserToFirestore(result.user, mergedExtra); // Save after signup
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
    // Always use Google displayName as name if not overridden
    const mergedExtra = { ...extra };
    if (result.user.displayName && !mergedExtra.name) mergedExtra.name = result.user.displayName;
    await saveUserToFirestore(result.user, mergedExtra);
    // No profile completion logic
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
