'use client';
import * as z from 'zod';
import React, { useState, useTransition } from 'react';
import CardWrapper from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { ResetSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { LuLoader2 } from 'react-icons/lu';
import { reset } from '@/actions/reset';

export const ResetForm = () => {

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');
    console.log(values);
    startTransition(() => {
      reset(values)
        .then((data) => {
          setError(data?.error);
          //   TODO: Add when we add 2FA
          setSuccess(data?.success);
        });
    });
  };
  return (
    <CardWrapper
      headerLabel="Forgot your password?"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                Reseting...
              </>
            ) : (
              <>Send reset email</>
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>

  );
};