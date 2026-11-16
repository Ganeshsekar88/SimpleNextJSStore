import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

const noStoreHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  Pragma: 'no-cache',
};

export async function POST(request: NextRequest) {
  if (process.env.DEMO_LOGIN_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Demo login is disabled for this deployment.' },
      { status: 404, headers: noStoreHeaders }
    );
  }

  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { error: 'The request origin did not match this deployment.' },
      { status: 403, headers: noStoreHeaders }
    );
  }

  const demoUserId = process.env.ADMIN2_USER_ID;
  if (!demoUserId || demoUserId !== process.env.ADMIN2_USER_ID) {
    return NextResponse.json(
      {
        error:
          'Demo account configuration is missing or mismatched. Set DEMO_CLERK_USER_ID and ADMIN3_USER_ID to the same Clerk user ID.',
      },
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
      {
        error:
          'Clerk could not issue a demo token. Check that CLERK_SECRET_KEY and the demo user ID belong to the same Clerk instance.',
      },
      { status: 502, headers: noStoreHeaders }
    );
  }
}
