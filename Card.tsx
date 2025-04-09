import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "bg-white rounded-lg shadow-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-gray-200",
        primary: "border border-[#004B87] bg-[#E6EEF4]",
        secondary: "border border-[#81C341] bg-[#81C341] bg-opacity-10",
        accent: "border border-[#F47920] bg-[#F47920] bg-opacity-10",
      },
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6",
      },
      hover: {
        default: "",
        lift: "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        glow: "transition-all duration-200 hover:shadow-md hover:shadow-[#E6EEF4]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, size, hover, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export default Card;
