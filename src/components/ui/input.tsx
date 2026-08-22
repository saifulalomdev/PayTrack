import * as React from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeClosed, KeyRound, Mail } from "lucide-react";

// 1. Extend input attributes to include our state modifier flag
interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className, 
  type, 
  error, // Destructure error state
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <div 
      data-error={error} // Visual anchor for custom styling selectors
      className={cn(
        "relative w-full flex items-center border border-input px-4 rounded-lg transition-all",
        // Standard interactive states
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        // 🔴 Error States: Changes border, outline ring, and inner icons to red
        "data-[error=true]:border-red-500 data-[error=true]:text-red-500",
        "data-[error=true]:focus-within:border-red-500 data-[error=true]:focus-within:ring-3 data-[error=true]:focus-within:ring-red-500/20"
      )}
    >
      {type === "email" && <Mail size={16} className="shrink-0" />}
      {type === "password" && <KeyRound size={16} className="shrink-0" />}
      
      <input
        ref={ref}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "h-12 w-full min-w-0 bg-transparent px-2 pr-10 py-1 text-lg transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
