import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-vitreous-white/10 animate-pulse rounded-md backdrop-blur-sm", className)}
      {...props}
    />
  )
}

export { Skeleton }
