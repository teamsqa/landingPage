'use client';

import { InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  "w-full rounded-lg border transition-colors focus:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        default: [
          "border-gray-300",
          "dark:border-gray-600",
          "bg-white",
          "dark:bg-gray-700",
          "text-gray-900",
          "dark:text-white",
          "focus:border-lime-500",
          "focus:ring-lime-200",
          "dark:focus:border-lime-400",
          "dark:focus:ring-lime-800",
          "placeholder-gray-400",
          "dark:placeholder-gray-500"
        ].join(" "),
        error: [
          "border-red-300",
          "dark:border-red-600",
          "bg-white",
          "dark:bg-gray-700",
          "text-red-900",
          "dark:text-red-100",
          "focus:border-red-500",
          "focus:ring-red-200",
          "dark:focus:border-red-400",
          "dark:focus:ring-red-800",
          "placeholder-red-300",
          "dark:placeholder-red-500"
        ].join(" "),
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-4 py-3 text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    }
  }
);

interface InputProps 
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

export function Input({ 
  label,
  error,
  variant = error ? "error" : "default",
  size,
  className,
  as = 'input',
  rows,
  ...props 
}: InputProps) {
  const Component = as === 'textarea' ? 'textarea' : 'input';
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          className={inputVariants({ variant, size, className })}
          rows={rows}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={inputVariants({ variant, size, className })}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}