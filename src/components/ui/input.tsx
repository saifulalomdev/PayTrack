import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed, KeyRound, Mail } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({
  className, 
  type, 
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const isPassword = type === "password";

  return (
    <div 
    className={cn(
      "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
      "relative w-full flex items-center border border-input px-4 rounded-full"
    )}
    >
      {type === "email" && <Mail size={16}/>}
      {type === "password" && <KeyRound size={16}/>}
      <input
        ref={ref}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 bg-transparent px-2.5 pr-10 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground  disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
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