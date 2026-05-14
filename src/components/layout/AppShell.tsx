import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { useApp } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Menu, X } from 'lucide-react'
import { pageVariants } from '@/lib/animations'

const TOTAL_STEPS = 12

const STEP_LABELS: Record<number, string> = {
  1: '创建项目',
  2: '选择短剧类型',
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

/* Desktop header (md+) */
function DesktopHeader() {
  const { state } = useApp()
  const { project, currentStep } = state

  return (
    <header
      className="hidden md:flex h-13 items-center px-5 border-b border-white/[0.05] bg-[#181B24]/80 backdrop-blur-sm flex-shrink-0"
      style={{ height: '52px' }}
    >
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

/* Mobile top bar (<md): hamburger + step pill + progress bar */
function MobileTopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { state } = useApp()
  const { project, currentStep, stepStatuses } = state
  const completed = stepStatuses.filter(s => s === 'completed').length
  const pct = (completed / TOTAL_STEPS) * 100

  return (
    <header
      className="md:hidden flex-shrink-0 bg-[#181B24]/95 backdrop-blur-md border-b border-white/[0.05]"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="h-12 flex items-center px-2 gap-1">
        <button
          onClick={onOpenMenu}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/[0.04] active:bg-white/[0.06] text-[#EDEEF0] transition-colors"
          aria-label="打开菜单"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0 flex items-center justify-center gap-1.5">
          <div className="h-6 px-2 rounded-full bg-[#E91E63]/[0.12] border border-[#EC407A]/30 flex items-center gap-1 flex-shrink-0">
            <span className="text-[11px] font-mono text-[#F06292] tabular-nums">
              {String(currentStep).padStart(2, '0')}
            </span>
            <span className="text-[11px] text-[#F06292]/50">/ {TOTAL_STEPS}</span>
          </div>
          <span className="text-[13px] font-medium text-[#EDEEF0] truncate">
            {STEP_LABELS[currentStep] ?? ''}
          </span>
        </div>
        {project ? (
          <div className="h-7 px-2 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center gap-1 flex-shrink-0">
            <Save className="w-3 h-3 text-[#8B8E96]" />
            <span className="text-[11px] text-[#B4B7BE] font-medium">草稿</span>
          </div>
        ) : (
          <span className="w-10" />
        )}
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#E91E63] to-[#EC4899]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </header>
  )
}

/* Mobile drawer wrapping the existing Sidebar */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.32 }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-[80%] max-w-[300px] shadow-2xl flex"
            style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <Sidebar onNavigate={onClose} mobileCloseButton={
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/[0.04] text-[#8B8E96]"
                aria-label="关闭菜单"
              >
                <X className="w-4 h-4" />
              </button>
            } />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { state } = useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-full overflow-hidden bg-[#12151C]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>
      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DesktopHeader />
        <MobileTopBar onOpenMenu={() => setDrawerOpen(true)} />
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
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/[0.04] flex items-start justify-between flex-shrink-0 gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] md:text-base font-semibold text-[#EDEEF0]">{title}</h2>
          {description && <p className="text-[12px] md:text-xs text-[#B4B7BE] mt-0.5 leading-snug">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-2 px-3 md:px-6 py-2.5 md:py-3 border-t border-white/[0.05] bg-[#181B24]/80 md:bg-[#181B24]/60 backdrop-blur-sm flex-shrink-0"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.625rem)' }}
    >
      {children}
    </div>
  )
}
