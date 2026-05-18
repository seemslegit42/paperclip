import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-roman-aqua/50",
  {
    variants: {
      variant: {
        default: "bg-imperial-purple text-vitreous-white hover:bg-imperial-purple/90 acquisition-glow",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-roman-aqua/30 bg-transparent text-roman-aqua hover:bg-roman-aqua/10 backdrop-blur-sm",
        secondary:
          "bg-patina-green text-obsidian-black hover:bg-patina-green/80",
        ghost:
          "hover:bg-vitreous-white/10 hover:text-vitreous-white text-conchoidal-gray",
        link: "text-roman-aqua underline-offset-4 hover:underline",
        acquisition: "bg-roman-aqua text-obsidian-black font-bold uppercase tracking-wider acquisition-glow hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-6 px-2 text-xs",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}, ref) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      ref={ref}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
