import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { useApp } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Save } from 'lucide-react'
import { pageVariants } from '@/lib/animations'

const STEP_LABELS: Record<number, string> = {
  1: '创建项目',
  2: '上传剧本',
  3: '剧本解析',
  4: '确认角色',
  5: '视觉风格',
  6: '生成分镜',
  7: '生成关键帧',
  8: '生成视频',
  9: '配音与字幕',
  10: '剪辑合成',
  11: '成片预览',
  12: '导出视频',
}

function Header() {
  const { state } = useApp()
  const { project, currentStep } = state

  return (
    <header className="h-13 flex items-center px-5 border-b border-white/[0.05] bg-[#0F1219]/80 backdrop-blur-sm flex-shrink-0" style={{ height: '52px' }}>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-sm text-[#B4B7BE] flex-shrink-0 font-medium">
          {project?.name ?? '未命名项目'}
        </span>
        <span className="text-[#5E6068] flex-shrink-0">/</span>
        <span className="text-sm text-[#EDEEF0] truncate font-medium">
          {STEP_LABELS[currentStep] ?? ''}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-[#8B8E96]">
          <Save className="w-3.5 h-3.5" />
          <span>自动保存</span>
        </div>
        {project && (
          <div className="h-6 px-2.5 rounded-full bg-[#E91E63]/10 border border-[#EC407A]/20 flex items-center">
            <span className="text-xs text-[#F06292] font-medium">草稿</span>
          </div>
        )}
      </div>
    </header>
  )
}

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { state } = useApp()

  return (
    <div className="flex h-full overflow-hidden bg-[#0B0D12]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={state.currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 overflow-y-auto will-change-transform"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export function PageLayout({
  children,
  title,
  description,
  action,
}: {
  children: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/[0.04] flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-[#EDEEF0]">{title}</h2>
          {description && <p className="text-xs text-[#B4B7BE] mt-0.5">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.05] bg-[#0F1219]/60 backdrop-blur-sm flex-shrink-0">
      {children}
    </div>
  )
}
