import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-3xl text-primary font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link href="/" className="text-primary font-bold hover:underline">
        <div className='flex '>
          Back to Home
          <ArrowRight className="w-4 h-4 ml-1 mt-1.5" />
        </div>
      </Link>
    </div>
  );
}
