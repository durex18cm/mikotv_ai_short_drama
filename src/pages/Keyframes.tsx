import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Lock, RotateCcw, ZoomIn, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { ShotPlaceholder } from '@/components/shared/ImagePlaceholder'
import { useApp } from '@/context/AppContext'
import { MOCK_EPISODES, getShotImageUrl } from '@/data/mockData'
import { sleep } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { GenStatus } from '@/types'
import { gridContainerVariants, gridItemVariants } from '@/lib/animations'

export function Keyframes() {
  const { state, dispatch } = useApp()
  const { shots } = state
  const [generating, setGenerating] = useState(false)
  const [selectedEp, setSelectedEp] = useState('ep1')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const epShots = shots.filter(s => s.episodeId === selectedEp)
  const allDone = shots.every(s => s.keyframeStatus === 'done' || s.keyframeStatus === 'locked')
  const doneCount = shots.filter(s => s.keyframeStatus === 'done' || s.keyframeStatus === 'locked').length

  async function generateAll() {
    setGenerating(true)
    const pending = shots.filter(s => s.keyframeStatus === 'idle' || s.keyframeStatus === 'failed')
    for (const shot of pending) {
      dispatch({ type: 'UPDATE_SHOT_KEYFRAME', shotId: shot.id, status: 'generating' })
      await sleep(400)
      dispatch({ type: 'UPDATE_SHOT_KEYFRAME', shotId: shot.id, status: 'done' })
    }
    setGenerating(false)
  }

  async function regenerate(shotId: string) {
    dispatch({ type: 'UPDATE_SHOT_KEYFRAME', shotId, status: 'generating' })
    await sleep(1000)
    dispatch({ type: 'UPDATE_SHOT_KEYFRAME', shotId, status: 'done' })
  }

  function toggleLock(shotId: string, current: GenStatus) {
    dispatch({
      type: 'UPDATE_SHOT_KEYFRAME',
      shotId,
      status: current === 'locked' ? 'done' : 'locked',
    })
  }

  return (
    <PageLayout title="生成关键帧" description="为每个镜头生成关键画面，确认满意后锁定，用于视频生成">
      <div className="flex flex-col h-full">
        {/* Top bar */}
        <div className="px-5 py-2.5 border-b border-white/[0.04] flex items-center gap-4 flex-shrink-0">
          <div className="flex gap-1">
            {MOCK_EPISODES.map(ep => (
              <button
                key={ep.id}
                onClick={() => setSelectedEp(ep.id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  selectedEp === ep.id
                    ? 'bg-[#E91E63]/20 text-[#F48FB1]'
                    : 'text-[#b8b8cc] hover:text-[#d8d8ec]'
                )}
              >
                第 {ep.num} 集
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="text-xs text-[#b8b8cc]">
            {doneCount} / {shots.length} 已生成
          </div>
          {!generating && (
            <Button
              variant="secondary"
              size="sm"
              onClick={generateAll}
              disabled={allDone}
            >
              <Image className="w-3.5 h-3.5" />
              {allDone ? '已全部生成' : '生成全部关键帧'}
            </Button>
          )}
          {generating && (
            <div className="flex items-center gap-2 text-xs text-[#F48FB1]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              正在批量生成...
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
          >
            {epShots.map(shot => {
              const status = shot.keyframeStatus
              const epNum = parseInt(selectedEp.slice(2))

              return (
                <motion.div
                  key={shot.id}
                  variants={gridItemVariants}
                  className="relative"
                >
                  <div className={cn(
                    'rounded-xl overflow-hidden border transition-all duration-200',
                    status === 'locked'
                      ? 'border-amber-500/40'
                      : status === 'done'
                      ? 'border-emerald-500/30'
                      : 'border-white/[0.06]'
                  )}>
                    <ShotPlaceholder
                      shotNum={shot.num}
                      episodeNum={epNum}
                      status={status === 'idle' ? 'idle' : status === 'generating' ? 'generating' : status === 'locked' ? 'locked' : 'done'}
                      imageUrl={getShotImageUrl(shot)}
                      className="w-full"
                    />

                    {/* Status overlay for generating */}
                    {status === 'generating' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                        <Loader2 className="w-6 h-6 text-[#F06292] animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-2 px-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-mono text-[#b8b8cc]">
                        SHOT {String(shot.num).padStart(2, '0')}
                      </span>
                      <Badge
                        variant={
                          status === 'locked' ? 'warning'
                          : status === 'done' ? 'success'
                          : status === 'generating' ? 'violet'
                          : status === 'failed' ? 'danger'
                          : 'muted'
                        }
                        dot={status !== 'idle'}
                      >
                        {status === 'idle' ? '未生成'
                          : status === 'generating' ? '生成中'
                          : status === 'done' ? '已生成'
                          : status === 'locked' ? '已锁定'
                          : '失败'}
                      </Badge>
                    </div>
                    <p className="text-[12px] text-[#b8b8cc] line-clamp-2 leading-snug mb-2">
                      {shot.description}
                    </p>

                    {/* Actions */}
                    {(status === 'done' || status === 'locked') && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => setLightbox(shot.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-[12px] text-[#c8c8e0]"
                        >
                          <ZoomIn className="w-3 h-3" />
                          查看
                        </button>
                        <button
                          onClick={() => toggleLock(shot.id, status)}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-1 py-1 rounded transition-colors text-[12px]',
                            status === 'locked'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] text-[#c8c8e0]'
                          )}
                        >
                          <Lock className="w-3 h-3" />
                          {status === 'locked' ? '已锁定' : '锁定'}
                        </button>
                        <button
                          onClick={() => regenerate(shot.id)}
                          className="py-1 px-2 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-[#c8c8e0]"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {status === 'idle' && (
                      <button
                        onClick={() => regenerate(shot.id)}
                        className="w-full py-1 rounded bg-[#E91E63]/10 hover:bg-[#E91E63]/20 transition-colors text-[12px] text-[#F06292] flex items-center justify-center gap-1"
                      >
                        <Image className="w-3 h-3" />
                        单独生成
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-h-full max-w-sm w-full"
                onClick={e => e.stopPropagation()}
              >
                {(() => {
                  const shot = shots.find(s => s.id === lightbox)!
                  const epNum = parseInt(shot.episodeId.slice(2))
                  return (
                    <div className="rounded-2xl overflow-hidden border border-white/10">
                      <ShotPlaceholder shotNum={shot.num} episodeNum={epNum} status="done" imageUrl={getShotImageUrl(shot)} className="w-full" />
                      <div className="bg-[#111128] p-4">
                        <p className="text-xs font-mono text-[#b8b8cc] mb-1">SHOT {String(shot.num).padStart(2, '0')}</p>
                        <p className="text-sm text-[#ededff] leading-relaxed">{shot.description}</p>
                        <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => setLightbox(null)}>
                          关闭
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ActionBar>
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })}>
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <Button onClick={() => dispatch({ type: 'GENERATE_KEYFRAMES' })} disabled={!allDone}>
            关键帧已确认，生成视频
            <ArrowRight className="w-4 h-4" />
          </Button>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
