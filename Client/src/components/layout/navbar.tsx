'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo (icon for now)*/}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </Link>

        {/* gonna change later or replace all */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </div>

        {/* Auth and theme toggle btn */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
