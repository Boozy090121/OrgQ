import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { logOut } from '@/lib/firebase/auth';
import { Button } from '@/lib/components/ui/button';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout, isViewOnly } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  
  // Check if current user is admin
  const isAdmin = user?.isAdmin && !isViewOnly;
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown') && !target.closest('.user-menu-button')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    }
  };
  
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004B87] md:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu size={24} />
            </button>
            
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-[#004B87]">PCI Quality Organization</h1>
            </div>
          </div>
          
          {/* Mobile title - center */}
          <div className="md:hidden">
            <h1 className="text-lg font-bold text-[#004B87]">PCI Quality</h1>
          </div>
          
          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search button - hidden on small mobile */}
            <div className="hidden sm:block">
              {searchOpen ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-40 md:w-64 pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              ) : (
                <button
                  type="button"
                  className="p-2 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            
            {/* Notifications */}
            <button
              type="button"
              className="p-2 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#004B87]"
            >
              <Bell size={20} />
            </button>
            
            {/* View-only indicator */}
            {isViewOnly && (
              <div className="hidden sm:block px-2 py-1 text-xs font-medium text-[#707070] bg-gray-100 rounded-md">
                View Only
              </div>
            )}
            
            {/* Admin badge */}
            {isAdmin && (
              <div className="hidden sm:block px-2 py-1 text-xs font-medium text-white bg-[#004B87] rounded-md">
                Admin
              </div>
            )}
            
            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="user-menu-button flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:ring-offset-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 bg-[#E6EEF4] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#004B87]">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </button>
              
              {/* Dropdown menu */}
              {showDropdown && (
                <div className="user-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-[#004B87]">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Your Profile
                  </Link>
                  
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      href="/dashboard/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search - full width below header */}
      <div className="sm:hidden px-4 py-2 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
