'use client';

import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "rounded-xl overflow-hidden transition-colors duration-200",
  {
    variants: {
      variant: {
        default: [
          "bg-white",
          "dark:bg-gray-800",
          "shadow-lg"
        ].join(" "),
        outline: [
          "bg-white",
          "dark:bg-gray-800",
          "border",
          "border-gray-200",
          "dark:border-gray-700"
        ].join(" "),
        elevated: [
          "bg-white",
          "dark:bg-gray-800",
          "shadow-xl"
        ].join(" "),
      },
      hover: {
        true: "transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: false,
    }
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ 
  children,
  variant,
  hover,
  className,
}: CardProps) {
  return (
    <div className={cardVariants({ variant, hover, className })}>
      {children}
    </div>
  );
}

export function CardHeader({ 
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ 
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}