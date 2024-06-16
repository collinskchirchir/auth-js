import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GitHub from 'next-auth/providers/github';
import Credentials from '@auth/core/providers/credentials';
import { LoginSchema } from '@/schema';
import { getUserByEmail, getUserById } from '@/data/user';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async session({token, session}){
      console.log({
        sessionToken: token
      })
      if(token.sub && session.user){
      session.user.id = token.sub
      }
      if(token.role && session.user){
        session.user.role = token.role
      }
      return session
    },
    async jwt({token}){
      if(!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if(!existingUser) return token
      token.role = existingUser.role
      return token
    }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const {email, password} = validatedFields.data;

          const user = await getUserByEmail(email)
          if(!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          )
          if(passwordsMatch) return user;
        }
        return null;
      }
    })
  ],
});