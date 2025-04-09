"use client";

import React from 'react';
// import Link from 'next/link'; // Unused
// import Image from 'next/image'; // Unused
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Unused currently
// import { Input } from "@/components/ui/input"; // Unused
// import { Menu, Bell, Search } from 'lucide-react'; // Unused Menu, Bell, Search
import { CircleUser, LogOut } from 'lucide-react'; // Keep CircleUser and LogOut
import { useAuth } from '@/lib/hooks/useAuth'; // Import useAuth hook
import { logOut as firebaseLogOut } from '@/lib/firebase/auth'; // Rename import to avoid conflict
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user } = useAuth(); // Get user state
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await firebaseLogOut(); // Use renamed logout function
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* Placeholder for potential future Sheet menu for mobile */}
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
             Placeholder Nav Items 
          </nav>
        </SheetContent>
      </Sheet> */}

      {/* Breadcrumb or Title Area (Optional) */}
      <div className="flex-1">
         {/* <h1 className="text-lg font-semibold">Dashboard</h1> */}
      </div>

      {/* Search Bar (Optional - Unused currently) */}
      {/* <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div> */}

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            {/* Use CircleUser as fallback/default icon */}
             <CircleUser className="h-5 w-5" />
            {/* <Image
              src="/placeholder-user.jpg" // Replace with actual user image if available
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            /> */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user ? user.email : 'My Account'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
             <LogOut className="mr-2 h-4 w-4" /> {/* Add LogOut icon here */}
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
} 