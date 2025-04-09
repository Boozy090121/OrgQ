import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004B87] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white hover:bg-gray-800",
        primary: "bg-[#004B87] text-white hover:bg-[#002D56]",
        secondary: "bg-[#81C341] text-white hover:bg-[#6BA135]",
        accent: "bg-[#F47920] text-white hover:bg-[#D66A1C]",
        outline: "border border-[#004B87] text-[#004B87] bg-transparent hover:bg-[#E6EEF4]",
        ghost: "bg-transparent text-[#004B87] hover:bg-[#E6EEF4]",
        link: "bg-transparent text-[#004B87] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, rounded, href, ...props }, ref) => {
    if (href) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
        >
          {props.children}
        </a>
      );
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
