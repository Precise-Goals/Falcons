import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import toast from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Global auth modal state ────────────────────────────
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  // ── Profile fetch ──────────────────────────────────────
  const fetchProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setUserProfile(snap.data());
        return snap.data();
      } else {
        setUserProfile(null);
        return null;
      }
    } catch {
      setUserProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Auth actions — all return profile so callers can navigate ──
  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchProfile(cred.user.uid);
      toast.success("Signed in");
      return profile; // caller uses this to decide where to navigate
    } catch (err) {
      const code = err.code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        toast.error("Check your email or password");
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts. Try again later");
      } else {
        toast.error("Something went wrong");
      }
      throw err;
    }
  };

  const signup = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const stub = {
        uid: cred.user.uid,
        email,
        role: "member",
        verified: false,
        onboardingComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", cred.user.uid), stub);
      setUserProfile(stub);
      toast.success("Account created");
      return stub; // always onboardingComplete: false → caller sends to /teams
    } catch (err) {
      const code = err.code;
      if (code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists");
      } else if (code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters");
      } else {
        toast.error("Something went wrong");
      }
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      let profile = null;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        profile = snap.data();
        setUserProfile(profile);
      } else {
        const stub = {
          uid: user.uid,
          email: user.email,
          role: "member",
          verified: false,
          onboardingComplete: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", user.uid), stub);
        profile = stub;
        setUserProfile(stub);
      }
      toast.success("Signed in");
      return profile;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Something went wrong");
      }
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    toast.success("Signed out");
  };

  const refreshProfile = async () => {
    if (currentUser) {
      return await fetchProfile(currentUser.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        signInWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
