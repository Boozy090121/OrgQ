"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '@/lib/firebase/config'; // Import db instance
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // Optional display name
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);

    try {
      console.log("Attempting signup for:", email);
      const firebaseUser = await signUp(email, password);
      // Log the returned user object
      console.log("Signup successful, Firebase User:", firebaseUser);
      
      // Add a check before accessing uid
      if (!firebaseUser?.uid) {
        throw new Error("Signup seemed successful but user object or UID is missing.");
      }

      console.log("Creating Firestore doc for UID:", firebaseUser.uid);
      // Create user document in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'associate', // Default role
        createdAt: Date.now(), // Use client-side timestamp for simplicity here
      });
      console.log("Firestore doc created successfully");
      
      router.push('/'); // Redirect to homepage on successful signup
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center text-[#004B87] mb-6">Sign Up</h1>
          <form onSubmit={handleSignup} className="space-y-4">
             <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} // Basic validation
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div>
              <Button 
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-[#004B87] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 