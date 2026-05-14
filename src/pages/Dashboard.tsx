import { motion } from 'framer-motion'
import { Plus, Film, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { MOCK_EXISTING_PROJECTS } from '@/data/mockData'
import type { Project } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_MAP = {
  draft: { label: '草稿', variant: 'muted' as const },
  'in-progress': { label: '创作中', variant: 'violet' as const },
  completed: { label: '已完成', variant: 'success' as const },
  exported: { label: '已导出', variant: 'info' as const },
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const status = STATUS_MAP[project.status]
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-[#12151C] border border-white/[0.06] rounded-xl p-5 cursor-pointer hover:border-white/[0.1] hover:bg-[#181B24] transition-all duration-200 group"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#E91E63]/10 border border-[#EC407A]/20 flex items-center justify-center">
          <Film className="w-5 h-5 text-[#F06292]" />
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      <h3 className="font-semibold text-[#EDEEF0] text-sm mb-1 group-hover:text-white transition-colors">{project.name}</h3>
      <div className="flex items-center gap-3 text-[13px] text-[#B4B7BE]">
        <span className="flex items-center gap-1"><Film className="w-3 h-3" /> {project.episodes} 集</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.duration}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {project.createdAt}</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1">
          {[...Array(project.episodes)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 w-8 rounded-full',
                project.status === 'exported' || project.status === 'completed'
                  ? 'bg-emerald-500/40'
                  : project.status === 'in-progress' && i === 0
                  ? 'bg-[#EC407A]/60'
                  : 'bg-white/[0.08]'
              )}
            />
          ))}
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#8B8E96] group-hover:text-[#F06292] transition-colors group-hover:translate-x-0.5" />
      </div>
    </motion.div>
  )
}

export function Dashboard() {
  const { dispatch } = useApp()

  function startNewProject() {
    dispatch({ type: 'NEW_PROJECT' })
  }

  function openProject() {
    dispatch({ type: 'NEW_PROJECT' })
  }

  return (
    <div className="min-h-full bg-[#0B0D12]">
      {/* Nav */}
      <header className="border-b border-white/[0.05] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/favorite.png" alt="Miko TV" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
          <span className="font-semibold text-[#EDEEF0]">Miko TV</span>
        </div>
        <Button size="sm" onClick={startNewProject}>
          <Plus className="w-4 h-4" />
          新建项目
        </Button>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E91E63]/10 border border-[#EC407A]/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#F06292]" />
            <span className="text-xs text-[#F48FB1] font-medium">AI 驱动的短剧创作平台</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight hero-gradient">
            AI 一键创作
          </h1>
          <p className="text-[#B4B7BE] text-base max-w-md mx-auto leading-relaxed">
            上传图片、创意，自动解析出大纲、剧本、分镜头、成片
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block mt-8"
          >
            <Button size="xl" onClick={startNewProject} className="shadow-lg shadow-[#880E4F]/30">
              <Plus className="w-5 h-5" />
              创建新项目
            </Button>
          </motion.div>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#0F1219] border border-white/[0.05] rounded-2xl p-6 mb-12"
        >
          <p className="text-[13px] text-[#5E6068] uppercase tracking-widest mb-4 font-medium">创作流程</p>
          <div className="flex items-center gap-0 overflow-x-auto">
            {['上传剧本', '确认角色', '选择风格', '一键生成', '局部修改', '导出视频'].map((label, i) => (
              <div key={i} className="flex items-center gap-0 flex-shrink-0">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E91E63]/10 border border-[#EC407A]/20 flex items-center justify-center">
                    <span className="text-[12px] font-semibold text-[#F06292]">{i + 1}</span>
                  </div>
                  <span className="text-[13px] text-[#B4B7BE] whitespace-nowrap">{label}</span>
                </div>
                {i < 5 && (
                  <div className="w-8 h-px bg-white/[0.06] mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-[#EDEEF0]">最近项目</h2>
            <span className="text-xs text-[#8B8E96]">{MOCK_EXISTING_PROJECTS.length} 个项目</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_EXISTING_PROJECTS.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <ProjectCard project={project} onOpen={openProject} />
              </motion.div>
            ))}
            {/* New project card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -2 }}
              onClick={startNewProject}
              className="border border-dashed border-white/[0.08] rounded-xl p-5 cursor-pointer hover:border-[#EC407A]/30 hover:bg-[#E91E63]/[0.03] transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:border-[#EC407A]/20 group-hover:bg-[#E91E63]/10 transition-all">
                <Plus className="w-5 h-5 text-[#8B8E96] group-hover:text-[#F06292] transition-colors" />
              </div>
              <p className="text-xs text-[#B4B7BE] group-hover:text-[#F48FB1] transition-colors">创建新项目</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
