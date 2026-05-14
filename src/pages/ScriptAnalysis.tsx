import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Cpu, Edit3, RotateCcw, ArrowRight, ArrowLeft, ListTree, Film, Info, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import { MOCK_EPISODES, MOCK_SCENES, MOCK_SHOTS } from '@/data/mockData'
import { cn, sleep } from '@/lib/utils'
import { gridContainerVariants, listItemVariants } from '@/lib/animations'

const REPARSE_PHASES = [
  '重新分析剧本结构…',
  '更新场景与镜头…',
  '刷新解析结果…',
]

export function ScriptAnalysis() {
  const { dispatch } = useApp()
  const [selectedEp, setSelectedEp] = useState('ep1')
  const [selectedShot, setSelectedShot] = useState(MOCK_SHOTS[0])
  const [editing, setEditing] = useState(false)
  const [editDesc, setEditDesc] = useState(selectedShot.description)
  const [mobileTab, setMobileTab] = useState<'nav' | 'shots' | 'detail'>('shots')
  const [reparsing, setReparsing] = useState(false)
  const [reparsePhase, setReparsePhase] = useState(0)
  const [reparseProgress, setReparseProgress] = useState(0)

  async function handleReparse() {
    if (reparsing) return
    setReparsing(true)
    setReparsePhase(0)
    setReparseProgress(0)
    const total = 2000
    const stepMs = total / REPARSE_PHASES.length
    for (let i = 0; i < REPARSE_PHASES.length; i++) {
      setReparsePhase(i)
      const ticks = 10
      for (let k = 1; k <= ticks; k++) {
        await sleep(stepMs / ticks)
        setReparseProgress(((i + k / ticks) / REPARSE_PHASES.length) * 100)
      }
    }
    setReparseProgress(100)
    dispatch({ type: 'PARSE_SCRIPT' })
    setReparsing(false)
  }

  const scenes = MOCK_SCENES.filter(s => s.episodeId === selectedEp)
  const shots = MOCK_SHOTS.filter(s => s.episodeId === selectedEp)

  function selectShot(shot: typeof MOCK_SHOTS[0]) {
    setSelectedShot(shot)
    setEditDesc(shot.description)
    setEditing(false)
    setMobileTab('detail')
  }

  return (
    <PageLayout
      title="剧本解析结果"
      description="AI 已自动拆解剧本，可查看和编辑各镜头信息"
      action={
        <Badge variant="success" dot className="whitespace-nowrap flex-shrink-0">
          {reparsing ? '解析中' : '解析完成'}
        </Badge>
      }
    >
      <div className="flex flex-col h-full relative">
        {/* Re-parse overlay */}
        <AnimatePresence>
          {reparsing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-[#12151C]/85 backdrop-blur-sm flex items-center justify-center px-6"
            >
              <div className="w-full max-w-md">
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#E91E63]/30 blur-2xl animate-pulse" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#9C27B0] flex items-center justify-center shadow-xl shadow-[#880E4F]/40">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#EDEEF0]">正在重新解析剧本</p>
                    <p className="text-[12px] text-[#8B8E96] mt-1">AI 将重新拆解剧集、场景与镜头</p>
                  </div>
                </div>
                <Progress value={reparseProgress} className="mb-4" />
                <div className="space-y-2">
                  {REPARSE_PHASES.map((p, i) => {
                    const done = i < reparsePhase
                    const active = i === reparsePhase
                    return (
                      <div key={p} className={cn('flex items-center gap-2 text-xs transition-opacity', done || active ? 'opacity-100' : 'opacity-40')}>
                        <span className={cn(
                          'w-4 h-4 rounded flex items-center justify-center flex-shrink-0',
                          done ? 'bg-emerald-500/15 text-emerald-400' : active ? 'bg-[#E91E63]/20 text-[#F06292]' : 'bg-white/[0.04] text-[#5E6068]'
                        )}>
                          <span className={cn('w-1 h-1 rounded-full', done ? 'bg-emerald-400' : active ? 'bg-[#EC407A] animate-pulse' : 'bg-[#5E6068]')} />
                        </span>
                        <span className={active ? 'text-[#F48FB1] font-medium' : 'text-[#B4B7BE]'}>{p}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="px-4 md:px-5 py-2.5 md:py-3 border-b border-white/[0.04] flex items-center gap-3 md:gap-4 flex-shrink-0 overflow-x-auto no-scrollbar">
          {[
            { label: '剧集', value: '3' },
            { label: '场景', value: '12' },
            { label: '镜头', value: '15' },
            { label: '台词', value: '28' },
            { label: '旁白', value: '9' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-sm font-semibold text-[#EDEEF0]">{item.value}</span>
              <span className="text-xs text-[#B4B7BE]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Mobile tab nav */}
        <div className="md:hidden flex items-center px-2 py-1.5 border-b border-white/[0.04] flex-shrink-0 gap-1">
          {[
            { id: 'nav' as const, label: '剧集', icon: ListTree },
            { id: 'shots' as const, label: `镜头 (${shots.length})`, icon: Film },
            { id: 'detail' as const, label: '详情', icon: Info },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setMobileTab(t.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 h-9 rounded-md text-[13px] font-medium transition-colors',
                mobileTab === t.id
                  ? 'bg-[#E91E63]/[0.12] text-[#F48FB1]'
                  : 'text-[#B4B7BE] hover:bg-white/[0.04]'
              )}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden md:grid md:grid-cols-[180px_1fr_300px] md:divide-x md:divide-white/[0.04]">
          {/* Episode/Scene nav */}
          <div className={cn(
            'overflow-y-auto py-2 h-full',
            'md:block',
            mobileTab === 'nav' ? 'block' : 'hidden'
          )}>
            {MOCK_EPISODES.map(ep => (
              <div key={ep.id}>
                <button
                  onClick={() => setSelectedEp(ep.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 flex items-center gap-2 transition-colors',
                    selectedEp === ep.id
                      ? 'text-[#EDEEF0] bg-white/[0.04]'
                      : 'text-[#B4B7BE] hover:text-[#D2D5DB]'
                  )}
                >
                  <ChevronRight className={cn('w-3 h-3 transition-transform flex-shrink-0', selectedEp === ep.id && 'rotate-90')} />
                  <span className="text-xs font-medium truncate">第 {ep.num} 集</span>
                </button>
                {selectedEp === ep.id && scenes
                  .filter(s => s.episodeId === ep.id)
                  .map(scene => (
                    <div key={scene.id} className="pl-6 pr-3 py-1.5">
                      <p className="text-[13px] text-[#B4B7BE] truncate">{scene.title}</p>
                    </div>
                  ))
                }
              </div>
            ))}
          </div>

          {/* Shot list */}
          <motion.div
            className={cn(
              'overflow-y-auto py-3 px-3 space-y-1.5 h-full',
              'md:block',
              mobileTab === 'shots' ? 'block' : 'hidden'
            )}
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
          >
            {shots.map(shot => (
              <motion.button
                key={shot.id}
                variants={listItemVariants}
                onClick={() => selectShot(shot)}
                className={cn(
                  'w-full text-left rounded-lg border p-3 transition-colors duration-150',
                  selectedShot.id === shot.id
                    ? 'bg-[#E91E63]/[0.08] border-[#EC407A]/30'
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08]'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-mono text-[#B4B7BE]">
                    SHOT {String(shot.num).padStart(2, '0')}
                  </span>
                  <Badge variant="muted">{shot.type}</Badge>
                </div>
                <p className="text-xs text-[#EDEEF0] leading-snug line-clamp-2">{shot.description}</p>
                {(shot.dialogue || shot.narrator) && (
                  <p className="text-[12px] text-[#B4B7BE] mt-1 line-clamp-1 italic">
                    {shot.dialogue ? `"${shot.dialogue}"` : shot.narrator}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[12px] text-[#5E6068]">{shot.duration}s</span>
                  {shot.characters.length > 0 && (
                    <span className="text-[12px] text-[#5E6068]">· {shot.characters.join('、')}</span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Detail panel */}
          <div className={cn(
            'overflow-y-auto p-4 space-y-4 bg-[#181B24]/40 h-full',
            'md:block',
            mobileTab === 'detail' ? 'block' : 'hidden'
          )}>
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-[#5E6068] uppercase tracking-widest font-medium">镜头详情</p>
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1 text-[13px] text-[#B4B7BE] hover:text-[#F06292] transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                {editing ? '取消' : '编辑'}
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: '镜头编号', value: `EP${selectedEp.slice(2)} · S${String(selectedShot.num).padStart(2, '0')}` },
                { label: '镜头类型', value: selectedShot.type },
                { label: '出现人物', value: selectedShot.characters.join('、') || '无' },
                { label: '动作描述', value: selectedShot.action },
                { label: '预计时长', value: `${selectedShot.duration}s` },
                { label: '音效', value: selectedShot.sfx || '—' },
                { label: '背景音乐', value: selectedShot.music || '—' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[12px] text-[#8B8E96] mb-0.5">{item.label}</p>
                  <p className="text-xs text-[#EDEEF0]">{item.value}</p>
                </div>
              ))}

              <div>
                <p className="text-[12px] text-[#8B8E96] mb-1">画面描述</p>
                {editing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      className="text-xs min-h-[80px]"
                    />
                    <Button size="sm" className="w-full" onClick={() => setEditing(false)}>
                      保存
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-[#EDEEF0] leading-relaxed">{editDesc}</p>
                )}
              </div>

              {selectedShot.dialogue && (
                <div>
                  <p className="text-[12px] text-[#8B8E96] mb-0.5">台词</p>
                  <p className="text-xs text-[#EDEEF0] italic">"{selectedShot.dialogue}"</p>
                </div>
              )}
              {selectedShot.narrator && (
                <div>
                  <p className="text-[12px] text-[#8B8E96] mb-0.5">旁白</p>
                  <p className="text-xs text-[#EDEEF0]">{selectedShot.narrator}</p>
                </div>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {}}
            >
              <RotateCcw className="w-3 h-3" />
              重新解析此镜头
            </Button>
          </div>
        </div>

        <ActionBar>
          <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={reparsing} className="md:hidden flex-shrink-0" aria-label="上一步">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={reparsing} className="hidden md:inline-flex">
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
            <Button variant="secondary" onClick={handleReparse} disabled={reparsing}>
              <Cpu className="w-4 h-4" />
              {reparsing ? '解析中' : '重新解析'}
            </Button>
            <Button onClick={() => dispatch({ type: 'NEXT_STEP' })} disabled={reparsing} className="flex-1 md:flex-initial">
              <span className="md:hidden">确认解析</span>
              <span className="hidden md:inline">确认剧本解析</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
