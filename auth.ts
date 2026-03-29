import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from '@/lib/validations/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          // Fetch the user from the database
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          // Compare hashed passwords
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
