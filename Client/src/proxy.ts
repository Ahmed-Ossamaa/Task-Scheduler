import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken');
  const { pathname } = request.nextUrl;
  
  //public routes
  const isAuthPage = 
  pathname.startsWith('/login') 
  || pathname.startsWith('/register') 
  || pathname.startsWith('/verify-email') 
  || pathname.startsWith('/forgot-password')
  || pathname.startsWith('/resend-verification');

  const isLandingPage = pathname === '/';
  const isPublicRoute = isAuthPage || isLandingPage;

  // User is Logged In 
  if (refreshToken) {
    // If logged in user tried to go to any of the auth pages
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Otherwise go wherever 
    return NextResponse.next();
  }
  

  // User is Guest (No Cookie)
  // Allow them to go to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Guest tries to visit Protected Route (Dashboard)
  // Redirect to Login
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
