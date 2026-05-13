import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-[#EDEEF0] placeholder:text-[#8B8E96] transition-colors',
        'hover:border-white/[0.12] focus:border-[#EC407A]/50 focus:bg-white/[0.06] focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'
