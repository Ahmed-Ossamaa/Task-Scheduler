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

interface NavbarProps {
  appName: string;
  logo: string | null;
}
export function Navbar({ appName, logo }: NavbarProps) {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 border-b border-border/50 bg-nav!">
      <div className="container mx-auto flex h-13 items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          {logo ? (
            <div className="relative h-13 w-30 ">
              <Image
                src={logo}
                alt={`${appName} logo`}
                fill
                sizes="100px"
                loading='eager'
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-red-500" />
            <span className="font-bold text-foreground">Schedio</span>
          </div>
          )}
        </Link>

        {/* navigation links */}
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
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 ">
                  <Avatar className="h-8 w-8 relative overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user?.avatar}
                        alt={user.name}
                        fill
                        sizes="32px"
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
