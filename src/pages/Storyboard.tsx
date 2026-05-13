import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout, ArrowRight, ArrowLeft, Edit3, RotateCcw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/context/AppContext'
import { MOCK_EPISODES, MOCK_SHOTS } from '@/data/mockData'
import { sleep } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Shot } from '@/types'
import { gridContainerVariants, listItemVariants } from '@/lib/animations'

export function Storyboard() {
  const { state, dispatch } = useApp()
  const [selectedEp, setSelectedEp] = useState('ep1')
  const [selectedShot, setSelectedShot] = useState<Shot>(MOCK_SHOTS[0])
  const [editing, setEditing] = useState(false)
  const [editDesc, setEditDesc] = useState(selectedShot.description)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generated, setGenerated] = useState(state.storyboardGenerated)

  const shots = MOCK_SHOTS.filter(s => s.episodeId === selectedEp)
  const eps = MOCK_EPISODES

  async function handleGenerate() {
    setGenerating(true)
    setProgress(0)
    for (let i = 1; i <= 10; i++) {
      await sleep(200)
      setProgress(i * 10)
    }
    setGenerating(false)
    setGenerated(true)
  }

  function handleNext() {
    dispatch({ type: 'GENERATE_STORYBOARD' })
  }

  return (
    <PageLayout title="生成分镜" description="基于剧本解析、角色设定和视觉风格，自动生成完整分镜表">
      <div className="flex flex-col h-full">
        {generating && (
          <div className="px-5 py-2 border-b border-white/[0.04] flex items-center gap-3 flex-shrink-0 bg-[#E91E63]/[0.04]">
            <Loader2 className="w-3.5 h-3.5 text-[#F06292] animate-spin" />
            <span className="text-xs text-[#F48FB1]">正在生成分镜表...</span>
            <Progress value={progress} className="flex-1 max-w-xs" />
          </div>
        )}

        <div className="flex-1 overflow-hidden grid grid-cols-[160px_1fr_280px] divide-x divide-white/[0.04]">
          {/* Episode nav */}
          <div className="overflow-y-auto py-3 px-2 space-y-0.5">
            {eps.map(ep => (
              <button
                key={ep.id}
                onClick={() => { setSelectedEp(ep.id); setSelectedShot(MOCK_SHOTS.find(s => s.episodeId === ep.id) ?? MOCK_SHOTS[0]) }}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg transition-all',
                  selectedEp === ep.id
                    ? 'bg-[#E91E63]/[0.1] text-[#EDEEF0]'
                    : 'text-[#B4B7BE] hover:bg-white/[0.04] hover:text-[#D2D5DB]'
                )}
              >
                <p className="text-xs font-medium">第 {ep.num} 集</p>
                <p className="text-[12px] text-[#8B8E96] mt-0.5">{ep.title}</p>
                <p className="text-[12px] text-[#5E6068] mt-1">{ep.shotCount} 镜头 · {ep.totalDuration}s</p>
              </button>
            ))}
          </div>

          {/* Shot table */}
          <div className="overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#0e0e1e] border-b border-white/[0.04]">
                <tr>
                  {['镜头', '画面描述', '台词/旁白', '时长', '类型', '操作'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-[12px] text-[#8B8E96] font-medium uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-white/[0.03]"
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
              >
                {shots.map(shot => (
                  <motion.tr
                    key={shot.id}
                    variants={listItemVariants}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    onClick={() => { setSelectedShot(shot); setEditDesc(shot.description); setEditing(false) }}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedShot.id === shot.id ? 'bg-[#E91E63]/[0.05]' : ''
                    )}
                  >
                    <td className="px-3 py-3 font-mono text-[12px] text-[#B4B7BE] whitespace-nowrap">
                      S{String(shot.num).padStart(2, '0')}
                    </td>
                    <td className="px-3 py-3 max-w-[220px]">
                      <p className="text-[#EDEEF0] line-clamp-2 leading-snug">{shot.description}</p>
                    </td>
                    <td className="px-3 py-3 max-w-[160px]">
                      <p className="text-[#B4B7BE] line-clamp-2 leading-snug italic text-[13px]">
                        {shot.dialogue ? `"${shot.dialogue}"` : shot.narrator ?? '—'}
                      </p>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-[#B4B7BE]">{shot.duration}s</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <Badge variant="muted">{shot.type}</Badge>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        className="text-[#8B8E96] hover:text-[#F06292] transition-colors p-1"
                        onClick={e => { e.stopPropagation(); setSelectedShot(shot); setEditing(true) }}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>

          {/* Detail panel */}
          <div className="overflow-y-auto p-4 space-y-4 bg-[#0F1219]/40">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-[#5E6068] uppercase tracking-widest font-medium">镜头详情</p>
              <span className="text-[13px] text-[#B4B7BE] font-mono">
                S{String(selectedShot.num).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[12px] text-[#8B8E96] mb-1">画面描述</p>
                {editing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      className="text-xs min-h-[80px]"
                    />
                    <Button size="sm" className="w-full" onClick={() => setEditing(false)}>保存</Button>
                  </div>
                ) : (
                  <p className="text-xs text-[#EDEEF0] leading-relaxed">{editDesc}</p>
                )}
              </div>

              {[
                { label: '镜头类型', value: selectedShot.type },
                { label: '出现人物', value: selectedShot.characters.join('、') || '无' },
                { label: '动作', value: selectedShot.action },
                { label: '时长', value: `${selectedShot.duration}s` },
                { label: '音效', value: selectedShot.sfx || '—' },
                { label: '背景音乐', value: selectedShot.music || '—' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[12px] text-[#8B8E96]">{item.label}</p>
                  <p className="text-xs text-[#EDEEF0] mt-0.5">{item.value}</p>
                </div>
              ))}

              {selectedShot.dialogue && (
                <div>
                  <p className="text-[12px] text-[#8B8E96]">台词</p>
                  <p className="text-xs text-[#EDEEF0] italic mt-0.5">"{selectedShot.dialogue}"</p>
                </div>
              )}
              {selectedShot.narrator && (
                <div>
                  <p className="text-[12px] text-[#8B8E96]">旁白</p>
                  <p className="text-xs text-[#EDEEF0] mt-0.5">{selectedShot.narrator}</p>
                </div>
              )}
            </div>

            <Button variant="secondary" size="sm" className="w-full">
              <RotateCcw className="w-3 h-3" />
              重新生成此镜头
            </Button>
          </div>
        </div>

        <ActionBar>
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })}>
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleGenerate} disabled={generating}>
              <Layout className="w-4 h-4" />
              {generating ? '生成中...' : generated ? '重新生成分镜' : '生成分镜'}
            </Button>
            <Button onClick={handleNext} disabled={!generated}>
              确认分镜，生成关键帧
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
