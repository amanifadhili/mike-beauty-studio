import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, id, required, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 font-sans relative w-full">
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm tracking-wider text-gray-300 uppercase flex gap-1"
          >
            {label} 
          </label>
        )}
        <input
          id={id}
          className={`
            w-full bg-transparent border-b border-gray-600 px-0 py-3 
            text-cream-white placeholder-gray-600 appearance-none
            focus:outline-none focus:border-gold focus:ring-0
            transition-colors duration-300 rounded-none
            ${className}
          `}
          ref={ref}
          required={required}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
