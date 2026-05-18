import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 transition-all backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-imperial-purple/20 text-vitreous-white border-imperial-purple/30",
        secondary: "bg-patina-green/20 text-patina-green border-patina-green/30",
        destructive: "bg-destructive/20 text-destructive border-destructive/30",
        outline: "border-vitreous-white/20 text-conchoidal-gray bg-transparent",
        ghost: "bg-transparent text-conchoidal-gray hover:bg-vitreous-white/10",
        link: "text-roman-aqua underline-offset-4 hover:underline border-transparent bg-transparent",
        roman: "bg-roman-aqua/20 text-roman-aqua border-roman-aqua/30",
        gilded: "bg-gilded-accent/20 text-gilded-accent border-gilded-accent/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
