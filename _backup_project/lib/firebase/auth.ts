import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/lib';

// Sign up a new user
export const signUp = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out the current user
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: User | null) => void, errorCallback: (error: Error) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Fetch user profile from Firestore 'users' collection
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let userProfileData: Partial<User> = {};
        if (userDocSnap.exists()) {
          userProfileData = userDocSnap.data() as Partial<User>;
        } else {
          // Handle case where user exists in Auth but not Firestore DB yet
          // Maybe create a default profile here?
          console.warn(`User profile for ${firebaseUser.uid} not found in Firestore.`);
          // Or provide default values
          userProfileData = { displayName: firebaseUser.displayName || 'New User', role: 'associate' }; // Example default
        }

        // Construct the User object
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: userProfileData.displayName || firebaseUser.displayName || undefined,
          role: userProfileData.role, // Get role from Firestore data
          // isAdmin is now derived in useAuth based on role, so no need to set it here
          isAdmin: userProfileData.role === 'admin' // Or calculate here if preferred
        };
        callback(user);
      } catch (error) {
        console.error("Error fetching user profile from Firestore:", error);
        // Decide how to handle: callback with partial user, null, or call errorCallback
        callback(null); // Callback with null if profile fetch fails?
        if (error instanceof Error) {
          errorCallback(error);
        }
      }
    } else {
      // No user logged in
      callback(null);
    }
  }, errorCallback); // Pass the error callback to onAuthStateChanged
};
