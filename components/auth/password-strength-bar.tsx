import React from 'react';
import { cn } from '@/lib/utils';
import { number } from 'zod';

interface PasswordStrengthBarProps {
  passwordScore: number;
}

export const PasswordStrengthBar = ({passwordScore}: PasswordStrengthBarProps) => {
  return (
    <div className='mt-2 flex'>
      {Array.from(Array(5).keys()).map((span, i) => (
        <span className='w-1/5 px-1' key={i}>
          <div className={cn(
            'h-2 rounded-xl',
            passwordScore <= 2 ? 'bg-rose-500' :
              passwordScore < 4 ? 'bg-yellow-400' : 'bg-emerald-500'

          )}></div>
        </span>
      ))}
    </div>
  );
};

