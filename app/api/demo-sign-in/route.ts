import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

const noStoreHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  Pragma: 'no-cache',
};

export async function POST(request: NextRequest) {
  if (process.env.DEMO_LOGIN_ENABLED !== 'true') {
    return new NextResponse(null, { status: 404, headers: noStoreHeaders });
  }

  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { error: 'Invalid request origin.' },
      { status: 403, headers: noStoreHeaders }
    );
  }

  const demoUserId = process.env.DEMO_CLERK_USER_ID;
  if (!demoUserId || demoUserId !== process.env.ADMIN3_USER_ID) {
    return NextResponse.json(
      { error: 'Demo sign-in is not configured.' },
      { status: 503, headers: noStoreHeaders }
    );
  }

  try {
    const client = await clerkClient();
    const { token } = await client.signInTokens.createSignInToken({
      userId: demoUserId,
      expiresInSeconds: 60,
    });

    return NextResponse.json({ token }, { headers: noStoreHeaders });
  } catch {
    return NextResponse.json(
      { error: 'Could not start demo sign-in.' },
      { status: 503, headers: noStoreHeaders }
    );
  }
}
