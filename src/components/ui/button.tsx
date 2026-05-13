import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]/40 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#E91E63] text-white hover:bg-[#EC4899] active:bg-[#BE185D]',
        secondary:
          'bg-white/[0.04] text-[#EDEEF0] hover:bg-white/[0.07] active:bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12]',
        ghost: 'text-[#B4B7BE] hover:bg-white/[0.04] hover:text-[#EDEEF0]',
        outline:
          'border border-white/[0.12] text-[#EDEEF0] hover:bg-white/[0.04] hover:border-white/[0.16]',
        destructive: 'bg-red-500/90 text-white hover:bg-red-500',
        success: 'bg-emerald-500 text-white hover:bg-emerald-400',
        link: 'text-[#F472B6] underline-offset-4 hover:underline p-0 h-auto font-normal',
      },
      size: {
        sm: 'h-7 px-3 text-xs rounded-md',
        default: 'h-9 px-4',
        lg: 'h-10 px-6 text-[15px]',
        xl: 'h-12 px-8 text-base rounded-xl',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
