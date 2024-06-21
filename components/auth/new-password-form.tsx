'use client';
import * as z from 'zod';
import React, { useState, useTransition } from 'react';
import CardWrapper from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { NewPasswordSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { LuLoader2 } from 'react-icons/lu';
import { newPassword } from '@/actions/new-password';
import { useSearchParams } from 'next/navigation';

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');


  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError('');
    setSuccess('');
    console.log(values);
    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          setError(data?.error);
          //   TODO: Add when we add 2FA
          setSuccess(data?.success);
        });
    });
  };
  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*  TODO: include 'Confirm password' field */}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LuLoader2
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                Resetting password...
              </>
            ) : (
              <>Reset password</>
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>

  );
};