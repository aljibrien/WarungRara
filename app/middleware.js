// /middleware.js
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';

const sessionOptions = {
  password: "session_password_1234567890!@#",
  cookieName: "warung_session",
};

export async function middleware(request) {
  const res = NextResponse.next();
  const session = await getIronSession(request.cookies, res, sessionOptions);

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
