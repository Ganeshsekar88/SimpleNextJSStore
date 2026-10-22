import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (_auth, req) => {
  const requestStart = performance.now();

  console.log({
    method: req.method,
    path: req.nextUrl.pathname,
    proxyElapsedMs: performance.now() - requestStart,
  });
});

export const config = {
  matcher: [
    // Match application routes, excluding Next.js internals and static files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always include API and tRPC routes.
    '/(api|trpc)(.*)',
  ],
};