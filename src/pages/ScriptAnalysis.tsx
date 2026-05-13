import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Cpu, Edit3, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import { MOCK_EPISODES, MOCK_SCENES, MOCK_SHOTS } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { gridContainerVariants, listItemVariants } from '@/lib/animations'

export function ScriptAnalysis() {
  const { dispatch } = useApp()
  const [selectedEp, setSelectedEp] = useState('ep1')
  const [selectedShot, setSelectedShot] = useState(MOCK_SHOTS[0])
  const [editing, setEditing] = useState(false)
  const [editDesc, setEditDesc] = useState(selectedShot.description)

  const scenes = MOCK_SCENES.filter(s => s.episodeId === selectedEp)
  const shots = MOCK_SHOTS.filter(s => s.episodeId === selectedEp)

  function selectShot(shot: typeof MOCK_SHOTS[0]) {
    setSelectedShot(shot)
    setEditDesc(shot.description)
    setEditing(false)
  }

  return (
    <PageLayout title="剧本解析结果" description="AI 已自动拆解剧本，可查看和编辑各镜头信息">
      <div className="flex flex-col h-full">
        {/* Stats */}
        <div className="px-5 py-3 border-b border-white/[0.04] flex items-center gap-4 flex-shrink-0">
          {[
            { label: '剧集', value: '3' },
            { label: '场景', value: '12' },
            { label: '镜头', value: '15' },
            { label: '台词', value: '28' },
            { label: '旁白', value: '9' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#EDEEF0]">{item.value}</span>
              <span className="text-xs text-[#B4B7BE]">{item.label}</span>
            </div>
          ))}
          <div className="flex-1" />
          <Badge variant="success" dot>解析完成</Badge>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-[180px_1fr_300px] divide-x divide-white/[0.04]">
          {/* Episode/Scene nav */}
          <div className="overflow-y-auto py-2">
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
            className="overflow-y-auto py-3 px-3 space-y-1.5"
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
          <div className="overflow-y-auto p-4 space-y-4 bg-[#0F1219]/40">
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
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })}>
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => dispatch({ type: 'PARSE_SCRIPT' })}>
              <Cpu className="w-4 h-4" />
              重新解析
            </Button>
            <Button onClick={() => dispatch({ type: 'GO_TO_STEP', step: 4 })}>
              确认剧本解析
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
