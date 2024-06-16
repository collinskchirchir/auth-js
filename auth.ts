import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GitHub from 'next-auth/providers/github';
import Credentials from '@auth/core/providers/credentials';
import { LoginSchema } from '@/schema';
import { getUserByEmail } from '@/data/user';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
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