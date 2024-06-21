'use server';

import { z } from 'zod';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';
import { signIn } from '@/auth';
import { LoginSchema } from '@/schema';
import { getUserByEmail } from '@/data/user';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  // Regenerate token if expired or !emailVerified
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    // Send verification token email
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: 'Confirmation email sent!' };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      // check token exists
      if(!twoFactorToken) {
        return {error: 'Invalid code!'}
      }
      // check if token matched with code submitted
      if(twoFactorToken.token !== code) {
        return {error: 'Invalid code!'}
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if(hasExpired) {
        return {error: 'Code Expired!'}
      }
      // delete token
      await db.twoFactorToken.delete({
        where: {id:  twoFactorToken.id },
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
      if(existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {id: existingConfirmation.id}
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        }
      })

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
      );
      return { twoFactor: true };
    }
  }

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