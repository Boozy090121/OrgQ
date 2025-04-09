"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthChange } from '@/lib/firebase/auth';
import { User } from '@/types';

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAdmin: false
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real application, this would use Firebase Auth
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Determine if the user is an admin
  const isAdmin = user?.role === 'admin';
  
  // The value that will be provided to consumers of this context
  const value = {
    user,
    loading,
    error,
    isAdmin
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
