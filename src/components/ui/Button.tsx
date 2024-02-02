import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";

const buttonVariantes = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-[8px] text-sm font-medium transition-color focus:ring-slate-400 focus:outline-none focus:ring-1  focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-40",
  
  {
    variants: {
      variant: {
        default: "bg-slate-800 text-white hover:bg-slate-700",
        ghost: "bg-transparent hover:text-slate-800 hover:bg-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariantes> {
    isLoading?: boolean
}

const Button: FC<ButtonProps> = ({className, children, variant, isLoading, size, ...props}) => {
  return (
    <button 
        className={cn(buttonVariantes({variant, size, className}))} 
        disabled={isLoading} 
        {...props}
    >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
        {children}

    </button>
  )
};
export default Button;
