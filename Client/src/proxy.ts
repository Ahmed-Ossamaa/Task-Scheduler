import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_ROUTES, PUBLIC_ROUTES } from './constants/routes-config';

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.get('hasSession');
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const isPublicPage = PUBLIC_ROUTES.some((route) => {
    // If the route is exactly the home page
    if (route === '/') {
      return pathname === '/'; 
    }
    // else, check for exact match || or if its a sub-route 
    return pathname === route || pathname.startsWith(`${route}/`); 
  });;

  const isPublicRoute = isAuthPage || isPublicPage;

  // User is Logged In
  if (hasSession) {
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
