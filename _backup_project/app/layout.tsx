import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AppProviders } from './provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PCI Quality Organization Dashboard',
  description: 'Dashboard for visualizing, managing, and planning the reorganization of PCI\'s quality department',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
