// src/components/ui/scroll-area.tsx
import * as React from "react"

export function ScrollArea({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
