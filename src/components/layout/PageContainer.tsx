import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <main className={cn("flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8", className)}>
      {children}
    </main>
  );
};

export default PageContainer; 