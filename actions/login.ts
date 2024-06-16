'use server';

import { LoginSchema } from '@/schema';
import { z } from 'zod';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const {email, password} = validatedFields.data
  try{
    // FIXME: Dont redirect incase of incorrect signin
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    });
  } catch (error) {
      console.error('LOGIN ERROR TYPE: ',error);
    if(error instanceof AuthError) {
      switch(error.type){
        case 'CredentialsSignin':
          return {error: "Invalid credentials!"};
        default:
          return {error: "Something went wrong"}
      }
    }
    throw error
  }
};