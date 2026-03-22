'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/features/auth/api/auth-api';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Make sure authApi.register is defined in your axios methods!
      await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Account created! Please log in.');
      router.push('/login');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-120 flex flex-col relative bg-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40">
      {' '}

      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-12 h-12 flex items-center justify-center mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <CheckCircle2 className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold tracking-tight">Task</span>
            <span className="text-xl font-bold tracking-tight text-primary">
              Flow
            </span>
          </Link>
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground mb-2">
          Create an account
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Set up your workspace in seconds.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Full Name *
          </label>
          <Input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-11 rounded-sm bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
            placeholder="Your Name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Email Address *
          </label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="h-11 rounded-sm bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Password *
          </label>
          <Input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="h-11 rounded-sm bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
            placeholder="••••••••"
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Confirm Password *
          </label>
          <Input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="h-11 rounded-sm bg-transparent border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
            placeholder="••••••••"
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 mt-2 w-full rounded-sm text-[11px] font-bold tracking-[0.12em] uppercase transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Sign Up →'
          )}
        </Button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-[12px] text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground font-medium hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
