import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  signInWithPopup
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  runTransaction
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { UserProfile, SavedReport, Currency } from "../types";

const USERS_COLLECTION = 'users';
const REPORTS_COLLECTION = 'reports';

export const authService = {
  loginWithGoogle: async (): Promise<UserProfile | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }

      // If new user, create profile
      const newUser: UserProfile = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        currency: 'INR' as Currency,
        credits: 5,
        hasCompletedOnboarding: false,
      };

      await setDoc(doc(db, USERS_COLLECTION, user.uid), newUser);
      return newUser;
    } catch (error) {
      console.error("Google login error:", error);
      return null;
    }
  },

  login: async (email: string, password: string): Promise<UserProfile | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  },

  register: async (name: string, email: string, password: string): Promise<UserProfile | string> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateFirebaseProfile(user, { displayName: name });

      const newUser: UserProfile = {
        id: user.uid,
        name,
        email,
        currency: 'INR' as Currency,
        credits: 5,
        hasCompletedOnboarding: false,
        // joinedAt: new Date().toISOString() // Not in original interface but good to have in DB
      };

      // Create user document
      await setDoc(doc(db, USERS_COLLECTION, user.uid), newUser);

      return newUser;
    } catch (error: any) {
      console.error("Registration error:", error);
      // Map firebase errors to user friendly messages if needed
      if (error.code === 'auth/email-already-in-use') {
        return "Email already exists";
      }
      return error.message || "Registration failed";
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  // This is now async or should be replaced by onAuthStateChanged in the Context
  // We keep it for simple checks if needed, but it checks Firestore
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  },

  updateProfile: async (updatedProfile: UserProfile): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, updatedProfile.id);
      await updateDoc(userRef, { ...updatedProfile });
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  deductCredit: async (userId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);

      return await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw "User does not exist!";
        }

        const userData = userDoc.data() as UserProfile;
        if (userData.credits > 0) {
          transaction.update(userRef, { credits: userData.credits - 1 });
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      console.error("Deduct credit error:", error);
      return false;
    }
  },

  completeOnboarding: async (userId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, { hasCompletedOnboarding: true });
    } catch (error) {
      console.error("Complete onboarding error:", error);
    }
  }
};

export const reportService = {
  saveReport: async (report: SavedReport): Promise<string> => {
    try {
      const docData = { ...report, timestamp: new Date().toISOString() };
      const reportId = Math.random().toString(36).substr(2, 9);
      docData.id = reportId;

      const existingData = localStorage.getItem('carscube_reports');
      const reports: SavedReport[] = existingData ? JSON.parse(existingData) : [];
      reports.push(docData as SavedReport);

      localStorage.setItem('carscube_reports', JSON.stringify(reports));
      return reportId;
    } catch (error) {
      console.error("Save report error:", error);
      throw error;
    }
  },

  getUserReports: async (userId: string): Promise<SavedReport[]> => {
    try {
      const existingData = localStorage.getItem('carscube_reports');
      if (!existingData) return [];

      const allReports: SavedReport[] = JSON.parse(existingData);
      const reports = allReports.filter(r => r.userId === userId);

      // Sort by timestamp descending (newest first)
      reports.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;

        // Handle invalid dates (NaN)
        const valA = isNaN(dateA) ? 0 : dateA;
        const valB = isNaN(dateB) ? 0 : dateB;

        return valB - valA;
      });

      return reports;
    } catch (error) {
      console.error("Get user reports error:", error);
      return [];
    }
  },

  getReportById: async (reportId: string): Promise<SavedReport | null> => {
    try {
      const existingData = localStorage.getItem('carscube_reports');
      if (!existingData) return null;

      const allReports: SavedReport[] = JSON.parse(existingData);
      const found = allReports.find(r => r.id === reportId);

      return found || null;
    } catch (error) {
      console.error("Get report error:", error);
      return null;
    }
  }
};
