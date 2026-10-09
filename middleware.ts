import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';

import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/about',
  '/login(.*)',
  '/register(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const requestStart = performance.now();

  const authStart = performance.now();
  const { userId } = await auth();

  const authDuration = performance.now() - authStart;

  const isAdminUser = userId === process.env.ADMIN_USER_ID;

  if (isAdminRoute(req) && !isAdminUser) {
    console.log({
      path: req.nextUrl.pathname,
      authDurationMs: authDuration,
      middlewareElapsedMs: performance.now() - requestStart,
    });

    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  console.log({
    path: req.nextUrl.pathname,
    authDurationMs: authDuration,
    middlewareElapsedMs: performance.now() - requestStart,
  });
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};