import { cn } from '@/lib/utils'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ className, label: _label, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-10 w-full appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] pl-3 pr-8 py-1.5 text-sm text-[#ededff] transition-colors cursor-pointer',
          'hover:border-white/[0.12] focus:border-[#EC407A]/50 focus:bg-white/[0.06] focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ababc8] pointer-events-none" />
    </div>
  )
}
