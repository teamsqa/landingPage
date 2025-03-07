'use client';

import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
  {
    variants: {
      variant: {
        default: [
          "bg-gray-100",
          "dark:bg-gray-700",
          "text-gray-800",
          "dark:text-gray-200"
        ].join(" "),
        primary: [
          "bg-lime-100",
          "dark:bg-lime-900",
          "text-lime-800",
          "dark:text-lime-200"
        ].join(" "),
        success: [
          "bg-green-100",
          "dark:bg-green-900",
          "text-green-800",
          "dark:text-green-200"
        ].join(" "),
        warning: [
          "bg-orange-100",
          "dark:bg-orange-900",
          "text-orange-800",
          "dark:text-orange-200"
        ].join(" "),
        danger: [
          "bg-red-100",
          "dark:bg-red-900",
          "text-red-800",
          "dark:text-red-200"
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ 
  children,
  variant,
  className,
}: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, className })}>
      {children}
    </span>
  );
}