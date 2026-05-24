// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

// export { default } from "next-auth/middleware";
// export const config = { matcher: ["/dashboard/:path*"] };

// create multiple middlewares
// https://stackoverflow.com/questions/76603369/how-to-use-multiple-middlewares-in-next-js-using-the-middleware-ts-file

import { getToken } from 'next-auth/jwt';
import type { NextFetchEvent } from 'next/server';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import { DEVICE_TYPE } from './types/device';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const session = await getToken({ req: request, secret });
  const nextActionHeader = request.headers.get('next-action');
  const isServerActionRequest = Boolean(nextActionHeader);

  // If there's no session (user is not authenticated) and trying to access protected routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth'; // Redirect to signin page
    return NextResponse.redirect(url);
  }

  // Only inject the viewport param for GET requests.
  // Rewriting non-GET requests (Server Action POSTs, form submissions) corrupts the
  // Next.js action-id lookup and multipart bodies, causing
  // "Failed to find Server Action" / "Unexpected end of form" in production.
  if (request.method !== 'GET') {
    // #region agent log
    event.waitUntil(
      fetch('http://127.0.0.1:7638/ingest/adc2a1c0-19d9-4b6f-ae7a-888f5620a0ee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0f60bd' },
        body: JSON.stringify({
          sessionId: '0f60bd',
          runId: 'post-fix',
          hypothesisId: 'H6',
          location: 'middleware.ts:35',
          message: 'middleware non-GET passthrough',
          data: {
            method: request.method,
            pathname: request.nextUrl.pathname,
            hasNextActionHeader: isServerActionRequest,
            contentType: request.headers.get('content-type') ?? null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
    );
    // #endregion
    return NextResponse.next();
  }

  const url = request.nextUrl;
  const { device } = userAgent(request);
  const viewport = device.type === DEVICE_TYPE.mobile ? DEVICE_TYPE.mobile : DEVICE_TYPE.desktop;

  // #region agent log
  event.waitUntil(
    fetch('http://127.0.0.1:7638/ingest/adc2a1c0-19d9-4b6f-ae7a-888f5620a0ee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0f60bd' },
      body: JSON.stringify({
        sessionId: '0f60bd',
        runId: 'post-fix',
        hypothesisId: 'H6',
        location: 'middleware.ts:58',
        message: 'middleware GET rewrite',
        data: {
          method: request.method,
          pathname: request.nextUrl.pathname,
          viewport,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  );
  // #endregion

  url.searchParams.set('viewport', viewport);
  return NextResponse.rewrite(url);
}

export const config = { matcher: ['/dashboard/:path*'] };
