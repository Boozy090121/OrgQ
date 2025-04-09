import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { DataProvider } from '@/lib/context/DataContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthProvider>
  );
}
