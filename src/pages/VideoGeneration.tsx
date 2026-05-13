import { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Play, RotateCcw, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/context/AppContext'
import { MOCK_EPISODES, getShotImageUrl } from '@/data/mockData'
import { sleep } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { gridContainerVariants, gridItemVariants } from '@/lib/animations'

const SHOT_GRADIENTS = [
  'linear-gradient(160deg, #1a1a3e 0%, #2d1b4e 60%, #1a0e2a 100%)',
  'linear-gradient(160deg, #1a1f0e 0%, #1e3a12 60%, #0a1a06 100%)',
  'linear-gradient(160deg, #2a1510 0%, #3a1e14 60%, #1a0806 100%)',
  'linear-gradient(160deg, #0f1a2a 0%, #142238 60%, #081218 100%)',
  'linear-gradient(160deg, #1a0e2a 0%, #2d1b4e 60%, #1a1a3e 100%)',
]

export function VideoGeneration() {
  const { state, dispatch } = useApp()
  const { shots } = state
  const [selectedEp, setSelectedEp] = useState('ep1')
  const [generating, setGenerating] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [playing, setPlaying] = useState<string | null>(null)

  const epShots = shots.filter(s => s.episodeId === selectedEp)
  const allDone = shots.every(s => s.videoStatus === 'done')
  const doneCount = shots.filter(s => s.videoStatus === 'done').length

  async function generateAll() {
    setGenerating(true)
    const pending = shots.filter(s => s.videoStatus === 'idle' || s.videoStatus === 'failed')
    for (let i = 0; i < pending.length; i++) {
      const shot = pending[i]
      dispatch({ type: 'UPDATE_SHOT_VIDEO', shotId: shot.id, status: 'generating' })
      await sleep(500)
      dispatch({ type: 'UPDATE_SHOT_VIDEO', shotId: shot.id, status: 'done' })
      setOverallProgress(((i + 1) / pending.length) * 100)
    }
    setGenerating(false)
  }

  async function regenerateShot(shotId: string) {
    dispatch({ type: 'UPDATE_SHOT_VIDEO', shotId, status: 'generating' })
    await sleep(1200)
    dispatch({ type: 'UPDATE_SHOT_VIDEO', shotId, status: 'done' })
  }

  return (
    <PageLayout title="生成视频片段" description="基于关键帧和镜头设定，为每个镜头生成视频片段">
      <div className="flex flex-col h-full">
        {/* Progress banner */}
        {generating && (
          <div className="px-5 py-2.5 border-b border-white/[0.04] flex items-center gap-3 flex-shrink-0 bg-[#E91E63]/[0.04]">
            <Loader2 className="w-3.5 h-3.5 text-[#F06292] animate-spin flex-shrink-0" />
            <span className="text-xs text-[#F48FB1]">正在批量生成视频片段...</span>
            <Progress value={overallProgress} className="flex-1 max-w-xs" />
            <span className="text-xs text-[#F48FB1]">{Math.round(overallProgress)}%</span>
          </div>
        )}

        {/* Tabs */}
        <div className="px-5 py-2 border-b border-white/[0.04] flex items-center gap-2 flex-shrink-0">
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
          <div className="flex-1" />
          <span className="text-xs text-[#b8b8cc]">{doneCount} / {shots.length} 已生成</span>
          <Button variant="secondary" size="sm" onClick={generateAll} disabled={generating || allDone}>
            <Video className="w-3.5 h-3.5" />
            {allDone ? '已全部生成' : '生成全部视频'}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
          >
            {epShots.map(shot => {
              const videoStatus = shot.videoStatus
              const epNum = parseInt(selectedEp.slice(2))
              const gradient = SHOT_GRADIENTS[(shot.num + epNum * 3 - 1) % SHOT_GRADIENTS.length]

              return (
                <motion.div
                  key={shot.id}
                  variants={gridItemVariants}
                >
                  {/* 9:16 Thumbnail */}
                  <div
                    className={cn(
                      'aspect-[9/16] rounded-xl overflow-hidden relative border',
                      videoStatus === 'done' ? 'border-emerald-500/30' :
                      videoStatus === 'generating' ? 'border-[#EC407A]/40' :
                      'border-white/[0.06]'
                    )}
                    style={{ background: gradient }}
                  >
                    {/* Real image when done */}
                    {videoStatus === 'done' && (
                      <img src={getShotImageUrl(shot)} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )}

                    {/* Generating spinner */}
                    {videoStatus === 'generating' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#F06292] animate-spin" />
                      </div>
                    )}

                    {/* Play button */}
                    {videoStatus === 'done' && (
                      <button
                        onClick={() => setPlaying(playing === shot.id ? null : shot.id)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all">
                          {playing === shot.id ? (
                            <div className="flex gap-0.5">
                              <span className="w-1 h-3.5 bg-white rounded" />
                              <span className="w-1 h-3.5 bg-white rounded" />
                            </div>
                          ) : (
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          )}
                        </div>
                      </button>
                    )}

                    {/* Play progress */}
                    {playing === shot.id && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-black/30">
                        <motion.div
                          className="h-full bg-white/60"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: shot.duration, ease: 'linear' }}
                          onAnimationComplete={() => setPlaying(null)}
                        />
                      </div>
                    )}

                    {/* Bottom info overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-white/70">S{String(shot.num).padStart(2,'0')}</span>
                        <span className="text-[11px] text-white/60">{shot.duration}s</span>
                      </div>
                    </div>

                    {/* Idle overlay */}
                    {videoStatus === 'idle' && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Below card info */}
                  <div className="mt-2 px-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={videoStatus === 'done' ? 'success' : videoStatus === 'generating' ? 'violet' : videoStatus === 'failed' ? 'danger' : 'muted'}
                        dot={videoStatus !== 'idle'}
                      >
                        {videoStatus === 'idle' ? '未生成' : videoStatus === 'generating' ? '生成中' : videoStatus === 'done' ? '已生成' : '失败'}
                      </Badge>
                      {videoStatus !== 'idle' && (
                        <button onClick={() => regenerateShot(shot.id)} className="p-1 rounded hover:bg-white/[0.08] text-[#b8b8cc] hover:text-[#d8d8ec] transition-colors">
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                      {videoStatus === 'idle' && (
                        <Button size="icon-sm" variant="secondary" onClick={() => regenerateShot(shot.id)}>
                          <Video className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#b8b8cc] line-clamp-2 leading-snug">{shot.description}</p>
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
          <Button onClick={() => dispatch({ type: 'GENERATE_VIDEOS' })} disabled={!allDone}>
            视频生成完成，配音与字幕
            <ArrowRight className="w-4 h-4" />
          </Button>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
