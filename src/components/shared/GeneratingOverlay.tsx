import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

interface GeneratingOverlayProps {
  visible: boolean
  phase: string
  progress: number
  title?: string
}

export function GeneratingOverlay({ visible, phase, progress, title = 'AI 正在生成' }: GeneratingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 bg-[#12151C]/80 backdrop-blur-sm rounded-xl flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="bg-[#1F2330] border border-white/[0.08] rounded-2xl p-8 w-80 flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#E91E63]/10 border border-[#EC407A]/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#F06292] animate-spin" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-xl border border-[#EC407A]/30"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#EDEEF0] mb-0.5">{title}</p>
              <p className="text-xs text-[#B4B7BE]">{phase}</p>
            </div>
            <div className="w-full">
              <Progress value={progress} />
              <p className="text-right text-[12px] text-[#B4B7BE] mt-1">{Math.round(progress)}%</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function InlineGenerating({ phases, currentPhase }: { phases: string[]; currentPhase: number }) {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="w-3.5 h-3.5 text-[#F06292] animate-spin flex-shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={currentPhase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-xs text-[#F48FB1]"
        >
          {phases[currentPhase] ?? '处理中...'}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
