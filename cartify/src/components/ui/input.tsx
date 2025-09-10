import * as React from 'react';
import { cn } from '../../utils';

const Input = ({ className = '', type, ...props }: React.ComponentProps<'input'>) => {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        className
      )}
      {...props}
    />
  );
};

export default Input;
