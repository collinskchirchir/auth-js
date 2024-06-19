'use client'
import {useCallback, useEffect, useState} from 'react'
import {BeatLoader} from 'react-spinners'

import {newVerification} from '@/actions/new-verification';
import CardWrapper from '@/components/auth/card-wrapper';
import { useSearchParams } from 'next/navigation';
import { FormSuccess } from '@/components/form-success';
import { FormError } from '@/components/form-error';

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!")
      return
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(()=> {
        setError('Something went wrong!')
      })
  },[token])
  useEffect(() => {
    onSubmit()
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel='Confirming your verification'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
     <div className='flex w-full items-center justify-center'>
        <BeatLoader />
       <FormSuccess message={success} />
       <FormError message={error} />
     </div>
    </CardWrapper>
  )
}
