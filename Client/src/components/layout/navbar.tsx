'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAuthStore } from '@/features/auth/store/auth.store';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';
import { useLogout } from '@/features/auth/hooks/use-auth';

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-nav/70 backdrop-blur-md">
      <div className="container mx-auto flex h-13 items-center justify-between px-4 md:px-8">
        {/* Logo (icon for now)*/}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <CheckCircle2 className="h-6 w-6 text-red-500" />
          <span className="text-xl font-bold tracking-tight">Task</span>
          <span className="text-xl font-bold tracking-tight">Flow</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase text-primary">
          <Link
            href="/#features"
            className="hover:text-foreground hover:scale-101 transition-colors "
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-foreground hover:scale-101 transition-colors"
          >
            How it Works
          </Link>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />

          {/* DYNAMIC AUTH STATE */}
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0 "
                >
                  <Avatar className="h-10 w-10 relative overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user?.avatar}
                        alt={user.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                    <span>({user.role})</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  disabled={isPending}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="text-[11px] font-bold tracking-[0.12em] uppercase rounded-sm text-primary hover:bg-primary/5 hover:text-foreground"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="text-[11px] font-bold tracking-[0.12em] uppercase rounded-sm"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
