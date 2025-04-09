import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/hooks/useAuth';

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
