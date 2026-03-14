import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // The matcher ensures middleware only runs on specific paths, allowing static files through
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
