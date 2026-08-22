import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from "@/utils/cn"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  error?: boolean; // Added state prop
}

function Label({
  className,
  error,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-error={error} // Visual anchor for Tailwind selector styling
      className={cn(
        "flex items-center gap-2 text-lg leading-none font-medium select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Turn label text red when error state is active
        "data-[error=true]:text-red-500 dark:data-[error=true]:text-red-400",
        className
      )}
      {...props}
    />
  )
}

export { Label }
