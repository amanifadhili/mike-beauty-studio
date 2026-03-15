import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Redirect users to /login when they need to authenticate
  },
  providers: [], // Add providers with an empty array for now
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        // Redirect authenticated users away from the login page to the dashboard
        return Response.redirect(new URL('/admin', nextUrl));
      }
      
      return true; // Allow access to all other public routes
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
