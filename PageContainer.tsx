"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function PageContainer({ children, title, className }: PageContainerProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Update document title
  useEffect(() => {
    if (title) {
      document.title = `${title} | PCI Quality Dashboard`;
    } else {
      document.title = 'PCI Quality Dashboard';
    }
  }, [title]);
  
  return (
    <div className={cn('px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl', className)}>
      {children}
    </div>
  );
}
