'use client';

import { cva, type VariantProps } from 'class-variance-authority';

const loadingVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16",
      },
      variant: {
        spinner: [
          "relative",
          "animate-spin",
          "rounded-full",
          "border-4",
          "border-gray-200",
          "dark:border-gray-700"
        ].join(" "),
        pulse: [
          "animate-pulse",
          "rounded-full",
          "bg-gray-200",
          "dark:bg-gray-700"
        ].join(" "),
      }
    },
    defaultVariants: {
      size: "md",
      variant: "spinner"
    }
  }
);

interface LoadingProps extends VariantProps<typeof loadingVariants> {
  className?: string;
  color?: string;
}

export function Loading({ 
  size, 
  variant = "spinner",
  className,
  color = "border-lime-500"
}: LoadingProps) {
  return (
    <div className={loadingVariants({ size, variant, className })}>
      {variant === "spinner" && (
        <div className={`absolute top-0 left-0 w-full h-full rounded-full border-t-4 ${color}`} />
      )}
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Loading size="lg" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loading size="lg" />
    </div>
  );
}