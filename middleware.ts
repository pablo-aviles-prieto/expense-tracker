// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

// export { default } from "next-auth/middleware";
// export const config = { matcher: ["/dashboard/:path*"] };

// create multiple middlewares
// https://stackoverflow.com/questions/76603369/how-to-use-multiple-middlewares-in-next-js-using-the-middleware-ts-file

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import { DEVICE_TYPE } from './types/device';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret });

  // If there's no session (user is not authenticated) and trying to access protected routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth'; // Redirect to signin page
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl;
  const { device, os } = userAgent(request);
  const viewport = device.type === DEVICE_TYPE.mobile ? DEVICE_TYPE.mobile : DEVICE_TYPE.desktop;
  url.searchParams.set('viewport', viewport);

  return NextResponse.rewrite(url);
}

export const config = { matcher: ['/dashboard/:path*'] };
