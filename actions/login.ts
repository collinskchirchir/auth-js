'use server';

import { LoginSchema } from '@/schema';
import { z } from 'zod';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }
  
  /** Regenerate token if expired or !emailVerified
   if (!existingUser.emailVerified) {
   const verificationToken = await generateVerificationToken(existingUser.email);
   return { success: 'Confirmation email sent!' };
   }
   */

  try {
    // FIXME: Dont redirect incase of incorrect signin
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.error('LOGIN ERROR TYPE: ', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
};