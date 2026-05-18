import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-vitreous-white/5 border-vitreous-white/20 text-vitreous-white placeholder:text-conchoidal-gray/50 h-10 w-full rounded-md border px-3 py-1 text-sm transition-all outline-none backdrop-blur-md",
        "focus:border-roman-aqua focus:ring-2 focus:ring-roman-aqua/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Input }
