import { ArrowLeft, Link } from 'lucide-react';
import {  buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';


export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your account password.',
};

export default function ForgotPasswordPage() {

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
        <CardContent className="pt-8 px-8 pb-4">
          <ForgotPasswordForm />
        </CardContent>

        <CardFooter className="flex justify-center pb-2 pt-2">
          <Link
            href="/login"
            className={buttonVariants({
              variant: 'link',
              className:
                'inline-flex items-center text-[12px] text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4',
            })}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
