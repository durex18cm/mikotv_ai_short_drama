import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, Volume2, Maximize2, SkipBack, SkipForward,
  ArrowRight, ArrowLeft, RotateCcw, Edit3, Mic, Music,
  Image, Video, FileText, Film,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import { MOCK_EPISODES, MOCK_SHOTS, getShotImageUrl } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { Shot } from '@/types'

const SHOT_GRADIENTS = [
  'linear-gradient(160deg, #1a1a3e 0%, #2d1b4e 60%, #1a0e2a 100%)',
  'linear-gradient(160deg, #1a1f0e 0%, #1e3a12 60%, #0a1a06 100%)',
  'linear-gradient(160deg, #2a1510 0%, #3a1e14 60%, #1a0806 100%)',
  'linear-gradient(160deg, #0f1a2a 0%, #142238 60%, #081218 100%)',
  'linear-gradient(160deg, #1a0e2a 0%, #2d1b4e 60%, #1a1a3e 100%)',
]

const EDIT_ACTIONS = [
  { icon: FileText, label: '修改台词', color: 'text-blue-400' },
  { icon: FileText, label: '修改旁白', color: 'text-sky-400' },
  { icon: Edit3, label: '修改画面描述', color: 'text-[#F06292]' },
  { icon: Image, label: '重新生成关键帧', color: 'text-amber-400' },
  { icon: Video, label: '重新生成视频片段', color: 'text-orange-400' },
  { icon: Mic, label: '重新生成配音', color: 'text-pink-400' },
  { icon: Music, label: '替换音乐', color: 'text-teal-400' },
  { icon: Film, label: '重新合成当前集', color: 'text-emerald-400' },
]

function MockVideoPlayer({ episodeId, selectedShot }: { episodeId: string; selectedShot: Shot | null }) {
  const [playing, setPlaying] = useState(false)
  const [progress] = useState(28)
  const ep = MOCK_EPISODES.find(e => e.id === episodeId)!
  const gradient = selectedShot
    ? SHOT_GRADIENTS[(selectedShot.num + parseInt(episodeId.slice(2)) * 3 - 1) % SHOT_GRADIENTS.length]
    : SHOT_GRADIENTS[0]

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: '480px' }}>
      {/* Video area */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradient }}>
        {/* Always show a keyframe image: selected shot or default cover */}
        <img
          src={selectedShot ? getShotImageUrl(selectedShot) : '/images/keyframes/huoqubing.png'}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)',
        }} />
        {/* Subtitle overlay */}
        {selectedShot?.dialogue && (
          <div className="absolute bottom-16 inset-x-4 text-center">
            <span className="text-white text-sm font-medium drop-shadow-lg bg-black/50 px-3 py-1 rounded">
              {selectedShot.dialogue}
            </span>
          </div>
        )}
      </div>

      {/* Controls overlay — always visible */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
        <div className="p-4">
          {/* Progress bar */}
          <div className="relative h-1 bg-white/20 rounded-full mb-3 cursor-pointer group">
            <div className="h-full bg-[#EC407A] rounded-full" style={{ width: `${progress}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
            />
          </div>
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button className="text-white/70 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
            </button>
            <button className="text-white/70 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <span className="text-white/50 text-[13px] font-mono ml-1">
              0:{String(Math.round(progress / 100 * ep.totalDuration)).padStart(2, '0')} / 0:{String(ep.totalDuration).padStart(2, '0')}
            </span>
            <div className="flex-1" />
            <Volume2 className="w-4 h-4 text-white/70" />
            <Maximize2 className="w-4 h-4 text-white/70" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Preview() {
  const { dispatch } = useApp()
  const [selectedEpId, setSelectedEpId] = useState('ep1')
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  const shots = MOCK_SHOTS.filter(s => s.episodeId === selectedEpId)
  const ep = MOCK_EPISODES.find(e => e.id === selectedEpId)!

  function handleEditAction(label: string) {
    setActionFeedback(label)
    setTimeout(() => setActionFeedback(null), 2000)
  }

  return (
    <PageLayout title="成片预览" description="观看完整短剧，点击镜头进行局部修改">
      <div className="flex flex-col h-full">
        {/* Episode selector */}
        <div className="px-4 md:px-5 py-2 border-b border-white/[0.04] flex items-center gap-2 flex-shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 flex-shrink-0">
            {MOCK_EPISODES.map(ep => (
              <button
                key={ep.id}
                onClick={() => { setSelectedEpId(ep.id); setSelectedShot(null); void 0 }}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                  selectedEpId === ep.id
                    ? 'bg-[#E91E63]/20 text-[#F48FB1]'
                    : 'text-[#B4B7BE] hover:text-[#D2D5DB]'
                )}
              >
                <span className="hidden md:inline">第 {ep.num} 集 · {ep.title}</span>
                <span className="md:hidden">第 {ep.num} 集</span>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <Badge variant="success" dot>合成完成</Badge>
        </div>

        <div className="flex-1 md:overflow-hidden overflow-y-auto md:grid md:grid-cols-[1fr_280px] md:divide-x md:divide-white/[0.04]">
          {/* Player area */}
          <div className="md:overflow-y-auto p-4 md:p-5 flex flex-col items-center gap-4 md:gap-5">
            <div className="w-full max-w-[240px] md:max-w-[260px]">
              <MockVideoPlayer episodeId={selectedEpId} selectedShot={selectedShot} />
            </div>

            {/* Edit panel */}
            <AnimatePresence>
              {selectedShot && (
                <motion.div
                  initial={{ opacity: 0, y: 12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 8, height: 0 }}
                  className="w-full max-w-[520px] overflow-hidden"
                >
                  <div className="bg-[#1F2330] border border-[#EC407A]/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-[#EDEEF0]">
                          局部修改 · SHOT {String(selectedShot.num).padStart(2, '0')}
                        </p>
                        <p className="text-[12px] text-[#B4B7BE] mt-0.5 line-clamp-1">{selectedShot.description}</p>
                      </div>
                      <button onClick={() => { setSelectedShot(null); void 0 }} className="text-[#8B8E96] hover:text-[#D2D5DB] text-[13px]">
                        取消
                      </button>
                    </div>

                    {actionFeedback && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-3 px-3 py-2 bg-[#E91E63]/10 border border-[#EC407A]/20 rounded-lg text-xs text-[#F48FB1] flex items-center gap-2"
                      >
                        <RotateCcw className="w-3 h-3 animate-spin" />
                        正在执行：{actionFeedback}...
                      </motion.div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {EDIT_ACTIONS.map(action => (
                        <button
                          key={action.label}
                          onClick={() => handleEditAction(action.label)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-white/[0.1] transition-all text-left"
                        >
                          <action.icon className={cn('w-3.5 h-3.5 flex-shrink-0', action.color)} />
                          <span className="text-[13px] text-[#D2D5DB]">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Shot list */}
          <div className="md:overflow-y-auto border-t md:border-t-0 border-white/[0.04]">
            <div className="p-3">
              <p className="text-[12px] text-[#5E6068] uppercase tracking-widest font-medium mb-2 px-1">
                镜头列表 · 第 {ep.num} 集
              </p>
              <div className="space-y-1.5">
                {shots.map(shot => {
                  const gradient = SHOT_GRADIENTS[(shot.num + parseInt(selectedEpId.slice(2)) * 3 - 1) % SHOT_GRADIENTS.length]
                  const isSelected = selectedShot?.id === shot.id

                  return (
                    <motion.button
                      key={shot.id}
                      whileHover={{ x: 2 }}
                      onClick={() => {
                        setSelectedShot(isSelected ? null : shot)
                        void 0
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all duration-150',
                        isSelected
                          ? 'bg-[#E91E63]/[0.1] border-[#EC407A]/30'
                          : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08]'
                      )}
                    >
                      {/* Thumbnail */}
                      <div
                        className="w-10 h-14 rounded-md flex-shrink-0 relative overflow-hidden"
                        style={{ background: gradient }}
                      >
                        <img
                          src={getShotImageUrl(shot)}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0.5 left-0.5 text-[7px] text-white/50 font-mono">
                          {shot.duration}s
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[13px] font-mono text-[#8B8E96]">
                            S{String(shot.num).padStart(2, '0')}
                          </span>
                          {shot.dialogue && <span className="text-[13px] text-[#8B8E96]">台词</span>}
                          {shot.narrator && <span className="text-[13px] text-[#8B8E96]">旁白</span>}
                        </div>
                        <p className="text-[13px] text-[#D2D5DB] line-clamp-2 leading-snug">
                          {shot.description}
                        </p>
                      </div>

                      {isSelected && (
                        <Edit3 className="w-3 h-3 text-[#F06292] flex-shrink-0" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <ActionBar>
          <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'PREV_STEP' })} className="md:hidden flex-shrink-0" aria-label="上一步">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })} className="hidden md:inline-flex">
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <Button onClick={() => dispatch({ type: 'NEXT_STEP' })} className="flex-1 md:flex-initial">
            <span className="md:hidden">导出视频</span>
            <span className="hidden md:inline">确认成片，导出视频</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
