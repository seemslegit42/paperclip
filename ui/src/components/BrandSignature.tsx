import * as React from "react"
import { cn } from "@/lib/utils"

export function BrandSignature() {
  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-[9999] pointer-events-none select-none",
        "flex flex-col gap-0.5 mix-blend-overlay opacity-40"
      )}
    >
      <div className="font-oracle font-bold text-[10px] leading-none text-vitreous-white uppercase tracking-normal">
        ΛΞV Inc
      </div>
      <div className="font-scribe font-light text-[8px] leading-none text-vitreous-white tracking-[0.2em] whitespace-nowrap">
        The Future Needs Context
      </div>
      <div className="font-scribe italic text-[7px] leading-none text-conchoidal-gray tracking-widest mt-0.5 opacity-60">
        Innovate, Automate, Dominate
      </div>
    </div>
  )
}
