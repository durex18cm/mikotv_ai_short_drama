import { useState } from 'react'
import { motion } from 'framer-motion'
import { Film, Video, Mic, Type, CheckCircle2, Loader2, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { SynthesisStatusBadge } from '@/components/shared/StatusBadge'
import { useApp } from '@/context/AppContext'
import { sleep } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { gridContainerVariants, gridItemVariants } from '@/lib/animations'

interface EpSynthState {
  progress: number
  phase: string
}

const SYNTHESIS_PHASES = [
  '整理镜头顺序...',
  '对齐配音时间轴...',
  '添加字幕图层...',
  '匹配背景音乐...',
  '混音与音效...',
  '添加转场效果...',
  '片头片尾处理...',
  '最终合成输出...',
]

export function AutoEdit() {
  const { state, dispatch } = useApp()
  const { episodes } = state
  const [epProgress, setEpProgress] = useState<Record<string, EpSynthState>>({})
  const [allGenerating, setAllGenerating] = useState(false)

  const allDone = episodes.every(ep => ep.synthesisStatus === 'done')

  async function synthesizeEpisode(epId: string) {
    dispatch({ type: 'GENERATE_SYNTHESIS', episodeId: epId, status: 'generating' })
    for (let i = 0; i < SYNTHESIS_PHASES.length; i++) {
      setEpProgress(prev => ({
        ...prev,
        [epId]: { progress: ((i + 1) / SYNTHESIS_PHASES.length) * 100, phase: SYNTHESIS_PHASES[i] },
      }))
      await sleep(400)
    }
    dispatch({ type: 'GENERATE_SYNTHESIS', episodeId: epId, status: 'done' })
    setEpProgress(prev => ({ ...prev, [epId]: { progress: 100, phase: '合成完成' } }))
  }

  async function synthesizeAll() {
    setAllGenerating(true)
    const pending = episodes.filter(ep => ep.synthesisStatus !== 'done')
    for (const ep of pending) {
      await synthesizeEpisode(ep.id)
    }
    setAllGenerating(false)
  }

  return (
    <PageLayout title="自动剪辑合成" description="将视频片段、配音、字幕、音效自动合成为完整短剧">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-5">
          {/* Summary */}
          <motion.div
            className="grid grid-cols-4 gap-3 mb-6"
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
          >
            {[
              { icon: Video, label: '视频片段', count: `${state.shots.length} 个`, ok: true },
              { icon: Mic, label: '配音音轨', count: `${state.characters.length + 1} 条`, ok: true },
              { icon: Type, label: '字幕文件', count: '13 条', ok: state.subtitleEnabled },
              { icon: Film, label: '背景音乐', count: '3 首', ok: true },
            ].map(item => (
              <motion.div
                key={item.label}
                variants={gridItemVariants}
                className="bg-[#111128] border border-white/[0.06] rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-[#b8b8cc]" />
                  <span className="text-xs text-[#c8c8e0]">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-[#ededff]">{item.count}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className={cn('w-3 h-3', item.ok ? 'text-emerald-400' : 'text-[#ababc8]')} />
                  <span className={cn('text-[12px]', item.ok ? 'text-emerald-400' : 'text-[#ababc8]')}>
                    {item.ok ? '就绪' : '已关闭'}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Episode cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
          >
            {episodes.map(ep => {
              const prog = epProgress[ep.id]
              const isGenerating = ep.synthesisStatus === 'generating'
              const isDone = ep.synthesisStatus === 'done'

              return (
                <motion.div
                  key={ep.id}
                  variants={gridItemVariants}
                  className={cn(
                    'bg-[#111128] border rounded-2xl overflow-hidden transition-colors',
                    isDone ? 'border-emerald-500/20' : isGenerating ? 'border-[#EC407A]/30' : 'border-white/[0.06]'
                  )}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center',
                          isDone ? 'bg-emerald-500/10' : isGenerating ? 'bg-[#E91E63]/10' : 'bg-white/[0.04]'
                        )}>
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isGenerating ? (
                            <Loader2 className="w-5 h-5 text-[#F06292] animate-spin" />
                          ) : (
                            <Film className="w-5 h-5 text-[#b8b8cc]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#ededff]">第 {ep.num} 集 · {ep.title}</p>
                          <p className="text-xs text-[#b8b8cc] mt-0.5">
                            {ep.shotCount} 个镜头 · 约 {ep.totalDuration}s · {ep.sceneCount} 个场景
                          </p>
                        </div>
                      </div>
                      <SynthesisStatusBadge status={ep.synthesisStatus} />
                    </div>

                    {/* Component statuses */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[
                        { label: '视频', done: true },
                        { label: '配音', done: true },
                        { label: '字幕', done: state.subtitleEnabled },
                        { label: '音乐', done: true },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-1.5 text-[12px]">
                          <CheckCircle2 className={cn('w-3 h-3', item.done ? 'text-emerald-400' : 'text-[#9494b4]')} />
                          <span className={item.done ? 'text-[#c0c0da]' : 'text-[#9494b4]'}>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress */}
                    {isGenerating && prog && (
                      <div className="mb-4 space-y-2">
                        <Progress value={prog.progress} />
                        <p className="text-[13px] text-[#F48FB1]">{prog.phase}</p>
                      </div>
                    )}

                    {isDone && (
                      <div className="flex items-center gap-2 py-2 px-3 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-lg mb-4">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[13px] text-emerald-300">第 {ep.num} 集合成完成，可以在预览页查看成片</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant={isDone ? 'secondary' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => synthesizeEpisode(ep.id)}
                        disabled={isGenerating || allGenerating}
                      >
                        {isDone ? (
                          <><RotateCcw className="w-3.5 h-3.5" />重新合成</>
                        ) : isGenerating ? (
                          <><Loader2 className="w-3.5 h-3.5 animate-spin" />合成中...</>
                        ) : (
                          <><Film className="w-3.5 h-3.5" />合成本集</>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <ActionBar>
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })}>
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={synthesizeAll} disabled={allGenerating || allDone}>
              <Film className="w-4 h-4" />
              {allDone ? '全部已合成' : '一键合成全部'}
            </Button>
            <Button onClick={() => dispatch({ type: 'GENERATE_ALL_SYNTHESIS' })} disabled={!allDone}>
              预览成片
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
