'use server';

import { RegisterSchema } from '@/schema';
import { z } from 'zod';
import { capitalizeWords } from '@/lib/utils';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse({
    ...values,
    name: capitalizeWords(values.name),
  });
  console.log(validatedFields);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  return { success: 'Email sent' };
};