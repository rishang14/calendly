"use client"

import { cn } from "@/lib/utils"
import { Children, cloneElement, ReactElement } from "react"

import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"

interface ButtonGroupProps {
  className?: string
  children: ReactElement<
    React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>
  >[]
}

export function ButtonGroup({ className, children }: ButtonGroupProps) {
  const total = Children.count(children)

  return (
    <div className={cn("flex flex-wrap gap-3 w-full", className)}>
      {Children.map(children, (child, index) => {
        const isFirst = index === 0
        const isLast = index === total - 1

        return cloneElement(child, {
          className: cn(
            {
            "rounded-l-none": !isFirst,
              "rounded-r-none": !isLast,
              "border-l-0": !isFirst, 
            },
            child.props.className
          ),
        })
      })}
    </div>
  )
}
