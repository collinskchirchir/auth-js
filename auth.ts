import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import { getUserById } from '@/data/user';
import { db } from '@/lib/db';
import authConfig from '@/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    // email verified automatically filled for OAuth accounts
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      if (user?.id) {
        const existingUser = await getUserById(user.id);

        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;
      } else {
        // if 'user.id' is undefined
        return false;
      }

      // TODO: Add 2FA check

      return true;
    },
    async session({ token, session }) {
      console.log({
        sessionToken: token,
      });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      // @ts-ignore
      token.role = existingUser.role;
      return token;
    },
  },
  ...authConfig,
});