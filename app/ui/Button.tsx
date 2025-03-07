'use client';

import { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        primary: [
          "bg-lime-500",
          "text-white",
          "hover:bg-lime-600",
          "dark:bg-lime-600",
          "dark:hover:bg-lime-700",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed"
        ].join(" "),
        secondary: [
          "bg-white",
          "dark:bg-gray-700",
          "border-2",
          "border-lime-500",
          "dark:border-lime-400",
          "text-lime-600",
          "dark:text-lime-400",
          "hover:bg-lime-50",
          "dark:hover:bg-gray-600",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed"
        ].join(" "),
        danger: [
          "bg-red-500",
          "text-white",
          "hover:bg-red-600",
          "dark:bg-red-600",
          "dark:hover:bg-red-700",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed"
        ].join(" "),
        orange: [
          "bg-orange-500",
          "text-white",
          "hover:bg-orange-600",
          "dark:bg-orange-600",
          "dark:hover:bg-orange-700",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed"
        ].join(" "),
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    }
  }
);

interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ 
  children, 
  variant, 
  size, 
  fullWidth,
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}