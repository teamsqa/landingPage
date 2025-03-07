'use client';

import { SelectHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const selectVariants = cva(
  "w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 appearance-none",
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
          "dark:focus:ring-lime-800"
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
          "dark:focus:ring-red-800"
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

interface SelectProps 
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export function Select({ 
  label,
  error,
  options,
  variant = error ? "error" : "default",
  size,
  className,
  ...props 
}: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={selectVariants({ variant, size, className })}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}