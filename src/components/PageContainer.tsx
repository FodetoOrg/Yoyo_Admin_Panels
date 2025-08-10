import { cn } from "@/lib/utils/utils"
import type { ReactNode } from "react"


export default function PageContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("mx-auto w-full  px-4 py-6 sm:px-6 lg:px-8", className)}>{children}</div>
}
