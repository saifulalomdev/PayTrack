import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebsiteStatusIconProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean | null;
}

export const WebsiteStatusIcon = React.forwardRef<HTMLDivElement, WebsiteStatusIconProps>(
  ({ className, isActive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-2.5 rounded-xl border transition-colors duration-200 inline-flex items-center justify-center",
          isActive
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "border-amber-500/20 bg-amber-500/10 text-amber-400",
          className
        )}
        {...props}
      >
        {isActive ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
      </div>
    );
  }
);

WebsiteStatusIcon.displayName = "WebsiteStatusIcon";