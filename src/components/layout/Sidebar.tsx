import { motion } from 'framer-motion'
import {
  FolderOpen, FileText, Cpu, Users, Palette, Layout,
  Image, Video, Mic, Film, Play, Download, Check, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import type { StepStatus } from '@/types'

const STEPS = [
  { id: 1, label: '创建项目', icon: FolderOpen },
  { id: 2, label: '选择短剧类型', icon: FileText },
  { id: 3, label: '剧本解析', icon: Cpu },
  { id: 4, label: '确认角色', icon: Users },
  { id: 5, label: '视觉风格', icon: Palette },
  { id: 6, label: '生成分镜', icon: Layout },
  { id: 7, label: '生成关键帧', icon: Image },
  { id: 8, label: '生成视频', icon: Video },
  { id: 9, label: '配音与字幕', icon: Mic },
  { id: 10, label: '剪辑合成', icon: Film },
  { id: 11, label: '成片预览', icon: Play },
  { id: 12, label: '导出视频', icon: Download },
]

function stepCanNavigate(stepId: number, statuses: StepStatus[]): boolean {
  const s = statuses[stepId]
  return s === 'active' || s === 'completed'
}

export function Sidebar() {
  const { state, dispatch } = useApp()
  const { currentStep, stepStatuses, project } = state

  return (
    <aside className="w-56 flex-shrink-0 h-full bg-[#0F1219] border-r border-white/[0.05] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <img
            src="/images/favorite.png"
            alt="Miko TV"
            className="w-8 h-8 rounded-md flex-shrink-0 object-cover"
          />
          <span className="font-semibold text-sm text-[#EDEEF0] tracking-tight">Miko TV</span>
        </div>
        {project && (
          <p className="text-[13px] text-[#B4B7BE] mt-2 truncate leading-tight pl-9">
            {project.name}
          </p>
        )}
      </div>

      {/* Steps */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {STEPS.map((step, idx) => {
          const status = stepStatuses[step.id] ?? 'pending'
          const isActive = currentStep === step.id
          const isCompleted = status === 'completed'
          const canClick = stepCanNavigate(step.id, stepStatuses)
          const Icon = step.icon
          const prevCompleted = idx === 0 || (stepStatuses[STEPS[idx - 1].id] === 'completed')

          return (
            <div key={step.id}>
              {/* connector line */}
              {idx > 0 && (
                <div className="flex justify-center">
                  <div
                    className={cn(
                      'w-px h-3 transition-colors duration-300',
                      prevCompleted ? 'bg-[#EC407A]/30' : 'bg-white/[0.04]'
                    )}
                  />
                </div>
              )}
              <button
                onClick={() => canClick && dispatch({ type: 'GO_TO_STEP', step: step.id })}
                disabled={!canClick}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group relative',
                  isActive
                    ? 'bg-[#E91E63]/[0.12] text-[#EDEEF0]'
                    : isCompleted
                    ? 'hover:bg-white/[0.04] text-[#D2D5DB]'
                    : 'text-[#8B8E96] cursor-default',
                  canClick && !isActive && 'hover:bg-white/[0.04] cursor-pointer'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 inset-y-1 w-0.5 bg-[#EC407A] rounded-full"
                  />
                )}
                {/* Icon / status indicator */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
                    isActive
                      ? 'bg-[#E91E63]/20 text-[#F06292]'
                      : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-white/[0.04] text-[#5E6068]'
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
                <span className="text-xs font-medium flex-1 leading-tight">{step.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-[#F06292] opacity-60" />
                )}
                {/* Step number */}
                <span
                  className={cn(
                    'text-[13px] font-mono tabular-nums',
                    isActive ? 'text-[#F06292]' : 'text-[#3F4250]'
                  )}
                >
                  {String(step.id).padStart(2, '0')}
                </span>
              </button>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.05]">
        <p className="text-[12px] text-[#3F4250] leading-relaxed">
          剧本进，短剧出
        </p>
      </div>
    </aside>
  )
}
