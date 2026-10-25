import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-[#E50920] text-white hover:bg-[#c4081a] focus:ring-[#E50920]",
      secondary: "bg-[#C7CBD0] text-[#050505] hover:bg-[#b0b4b9] focus:ring-[#C7CBD0]",
      outline: "border-2 border-[#C7CBD0] text-[#C7CBD0] hover:bg-[#C7CBD0] hover:text-[#050505] focus:ring-[#C7CBD0]",
      ghost: "text-[#C7CBD0] hover:bg-[#151515] focus:ring-[#C7CBD0]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-7 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
