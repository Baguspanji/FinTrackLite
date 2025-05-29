
"use client";

import { PiggyBank, LogIn, LogOut, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { currentUser, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <PiggyBank className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-2xl font-semibold text-foreground">
            FinTrack Lite
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {loading ? (
            <Button variant="outline" size="sm" disabled>
              Memuat...
            </Button>
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User Avatar"} />
                    <AvatarFallback>
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserCircle2 />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.displayName || "Pengguna"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={signInWithGoogle}>
              <LogIn className="mr-2 h-4 w-4" />
              Login dengan Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
