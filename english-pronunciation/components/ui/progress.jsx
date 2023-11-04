"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  let progressBarColor;
  if (value < 50) {
    progressBarColor = 'bg-red-500';
  } else if (value >= 50 && value <= 80) {
    progressBarColor = 'bg-yellow-500';
  } else {
    progressBarColor = 'bg-green-500';
  }

  return <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}>
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 transition-all", progressBarColor)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
