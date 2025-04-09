import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isViewOnly } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user && !isViewOnly) {
        router.push('/auth/login');
      } else if (adminOnly && !user?.isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, adminOnly, isViewOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E6EEF4]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#004B87] border-t-transparent"></div>
          <p className="mt-2 text-[#707070]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isViewOnly) {
    return null;
  }

  if (adminOnly && !user?.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
