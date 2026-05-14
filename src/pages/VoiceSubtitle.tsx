import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2, VolumeX, RotateCcw, ArrowRight, ArrowLeft, Edit3, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ActionBar } from '@/components/layout/AppShell'
import { CharacterAvatar } from '@/components/shared/ImagePlaceholder'
import { useApp } from '@/context/AppContext'
import { MOCK_SUBTITLES, getCharacterImageUrl, getCharacterAvatarPosition } from '@/data/mockData'
import { sleep } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Character } from '@/types'
import { gridContainerVariants, gridItemVariants } from '@/lib/animations'

function VoiceCard({
  character, generated, generating,
}: { character: Character; generated: boolean; generating: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [regen, setRegen] = useState(false)

  async function tryPlay() {
    setPlaying(true)
    await sleep(2000)
    setPlaying(false)
  }

  async function regenerate() {
    setRegen(true)
    await sleep(1000)
    setRegen(false)
  }

  return (
    <div className="bg-[#1F2330] border border-white/[0.06] rounded-xl p-4 flex flex-col relative overflow-hidden">
      {/* Per-card progress bar shown while this character is being generated */}
      {generating && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full bg-[#E91E63]"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <CharacterAvatar
          name={character.name}
          colorHue={character.colorHue}
          size="sm"
          imageUrl={getCharacterImageUrl(character.name)}
          imagePosition={getCharacterAvatarPosition(character.name)}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#EDEEF0]">{character.name}</p>
          <p className="text-[12px] text-[#B4B7BE] truncate">{character.role}</p>
        </div>
        {generating && !generated && (
          <span className="text-[11px] text-[#F06292] animate-pulse">生成中…</span>
        )}
        {generated && <Badge variant="success" dot>已生成</Badge>}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <Label className="mb-1 block">性别</Label>
          <Select defaultValue={character.voiceGender} className="h-9 text-xs">
            <option value="male">男声</option>
            <option value="female">女声</option>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">年龄感</Label>
          <Select defaultValue={character.voiceAge} className="h-9 text-xs">
            <option value="young">年轻</option>
            <option value="mature">成熟</option>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">语言</Label>
          <Select defaultValue="zh" className="h-9 text-xs">
            <option value="zh">普通话</option>
            <option value="en">英文</option>
          </Select>
        </div>
      </div>

      <p className="text-[12px] text-[#B4B7BE] mb-3 italic flex-1">"{character.voiceDesc}"</p>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={tryPlay} disabled={!generated}>
          {playing ? <><VolumeX className="w-3 h-3" />停止试听</> : <><Volume2 className="w-3 h-3" />试听</>}
        </Button>
        <Button variant="ghost" size="sm" onClick={regenerate} disabled={regen}>
          <RotateCcw className={cn('w-3 h-3', regen && 'animate-spin')} />
        </Button>
      </div>
    </div>
  )
}

export function VoiceSubtitle() {
  const { state, dispatch } = useApp()
  const { characters, subtitleEnabled } = state
  const [activeTab, setActiveTab] = useState<'voice' | 'subtitle'>('voice')
  const [voiceGenerated, setVoiceGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedCharIds, setGeneratedCharIds] = useState<string[]>([])
  const [currentGenCharId, setCurrentGenCharId] = useState<string | null>(null)
  const [editingSubId, setEditingSubId] = useState<string | null>(null)
  const [subtitles, setSubtitles] = useState(MOCK_SUBTITLES)
  const [subTexts, setSubTexts] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_SUBTITLES.map(s => [s.id, s.text]))
  )
  const [activeEp, setActiveEp] = useState('ep1')

  const epSubs = subtitles.filter(s => s.episodeId === activeEp)
  const totalVoiceSlots = characters.length + 1 // characters + narrator
  const overallProgress = (generatedCharIds.length / totalVoiceSlots) * 100

  async function generateAll() {
    setGenerating(true)
    setGeneratedCharIds([])
    setCurrentGenCharId(null)
    // Cycle through each character + narrator so users see live progress
    const queue = [...characters.map(c => c.id), 'narrator']
    for (const id of queue) {
      setCurrentGenCharId(id)
      await sleep(400)
      setGeneratedCharIds(prev => [...prev, id])
    }
    setCurrentGenCharId(null)
    setGenerating(false)
    setVoiceGenerated(true)
  }

  function saveSubtitle(id: string) {
    setSubtitles(prev => prev.map(s => s.id === id ? { ...s, text: subTexts[id] } : s))
    setEditingSubId(null)
  }

  // Tab button style
  const tabBtn = (tab: 'voice' | 'subtitle') =>
    cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
      activeTab === tab
        ? 'bg-[#1e1e3a] text-[#EDEEF0] shadow-sm'
        : 'text-[#B4B7BE] hover:text-[#EDEEF0]'
    )

  return (
    // Full-height flex column — owns its own layout, does NOT rely on PageLayout's children wrapper
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Page title ──────────────────────────────────────────── */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/[0.04] flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-[15px] md:text-base font-semibold text-[#EDEEF0]">配音与字幕</h2>
          <p className="text-[12px] md:text-xs text-[#B4B7BE] mt-0.5 leading-snug">为角色台词和旁白自动生成配音，并生成字幕</p>
        </div>
      </div>

      {/* ── Overall generation progress — always visible at top while generating ── */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-4 md:px-5 py-2.5 border-b border-white/[0.04] bg-[#E91E63]/[0.05] flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Loader2 className="w-3.5 h-3.5 text-[#F06292] animate-spin flex-shrink-0" />
              <span className="text-xs font-medium text-[#F48FB1] flex-shrink-0">正在生成配音</span>
              {currentGenCharId && (
                <span className="text-[12px] text-[#B4B7BE] truncate">
                  · {currentGenCharId === 'narrator' ? '旁白' : characters.find(c => c.id === currentGenCharId)?.name ?? ''}
                </span>
              )}
              <span className="ml-auto text-xs font-mono text-[#F48FB1] tabular-nums flex-shrink-0">
                {generatedCharIds.length} / {totalVoiceSlots}
              </span>
            </div>
            <Progress value={overallProgress} />
          </motion.div>
        )}
      </AnimatePresence>
      {!generating && voiceGenerated && activeTab === 'voice' && (
        <div className="px-4 md:px-5 py-2 border-b border-emerald-500/15 bg-emerald-500/[0.05] flex items-center gap-2 flex-shrink-0">
          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs text-emerald-300 font-medium">全部配音已生成完成</span>
        </div>
      )}

      {/* ── Tab navigation ──────────────────────────────────────── */}
      <div className="px-4 md:px-5 pt-3 pb-2 md:pb-0 border-b border-white/[0.04] flex flex-col md:flex-row md:items-center md:justify-between gap-2 flex-shrink-0">
        <div className="inline-flex items-center gap-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] p-1 self-start">
          <button className={tabBtn('voice')} onClick={() => setActiveTab('voice')}>
            <Mic className="w-3 h-3" />角色配音
          </button>
          <button className={tabBtn('subtitle')} onClick={() => setActiveTab('subtitle')}>
            <Edit3 className="w-3 h-3" />字幕管理
          </button>
        </div>
        <div className="flex items-center gap-2 md:pb-2">
          <Switch
            checked={subtitleEnabled}
            onCheckedChange={() => dispatch({ type: 'TOGGLE_SUBTITLE' })}
            id="subtitle-toggle"
          />
          <Label htmlFor="subtitle-toggle" className="cursor-pointer">
            {subtitleEnabled ? '字幕已开启' : '字幕已关闭'}
          </Label>
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────────────────── */}
      {/* This flex-1 div fills ALL remaining space between tabs nav and action bar */}
      <div className="flex-1 overflow-hidden flex flex-col">

        {/* ── 角色配音 ── */}
        {activeTab === 'voice' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Scrollable cards area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
              >
                {characters.map(char => (
                  <motion.div
                    key={char.id}
                    variants={gridItemVariants}
                  >
                    <VoiceCard
                      character={char}
                      generated={generatedCharIds.includes(char.id) || voiceGenerated}
                      generating={currentGenCharId === char.id}
                    />
                  </motion.div>
                ))}

                {/* Narrator card */}
                <motion.div
                  variants={gridItemVariants}
                  className="bg-[#1F2330] border border-white/[0.06] rounded-xl p-4 flex flex-col relative overflow-hidden"
                >
                  {currentGenCharId === 'narrator' && (
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full bg-[#E91E63]"
                        initial={{ x: '-100%' }}
                        animate={{ x: '0%' }}
                        transition={{ duration: 0.4, ease: 'linear' }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a3a] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-[#B4B7BE]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#EDEEF0]">旁白</p>
                      <p className="text-[12px] text-[#B4B7BE]">系统旁白音</p>
                    </div>
                    {currentGenCharId === 'narrator' && (
                      <span className="text-[11px] text-[#F06292] animate-pulse">生成中…</span>
                    )}
                    {(generatedCharIds.includes('narrator') || voiceGenerated) && currentGenCharId !== 'narrator' && (
                      <Badge variant="success" dot>已生成</Badge>
                    )}
                  </div>
                  <p className="text-[12px] text-[#B4B7BE] mb-3 italic flex-1">"史诗感男声，低沉有力，富有感染力"</p>
                  <Button variant="secondary" size="sm" className="w-full" disabled={!(generatedCharIds.includes('narrator') || voiceGenerated)}>
                    <Volume2 className="w-3 h-3" />试听旁白音色
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Generate button — pinned at bottom, only shown when not yet generated */}
            {!voiceGenerated && (
              <div className="flex-shrink-0 px-4 md:px-5 py-3 md:py-4 border-t border-white/[0.05] flex justify-center bg-[#12151C]/60">
                <Button
                  size="lg"
                  onClick={generateAll}
                  disabled={generating}
                  className="shadow-lg shadow-[#880E4F]/20 w-full md:w-auto md:min-w-[200px]"
                >
                  <Mic className="w-5 h-5" />
                  {generating ? '生成配音中...' : '生成全部配音'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── 字幕管理 ── */}
        {activeTab === 'subtitle' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-5 py-2 border-b border-white/[0.04] flex gap-2 flex-shrink-0">
              {['ep1', 'ep2', 'ep3'].map((epId, i) => (
                <button
                  key={epId}
                  onClick={() => setActiveEp(epId)}
                  className={cn(
                    'px-3 py-1 rounded text-xs transition-all',
                    activeEp === epId ? 'bg-[#E91E63]/20 text-[#F48FB1]' : 'text-[#B4B7BE] hover:text-[#D2D5DB]'
                  )}
                >
                  第 {i + 1} 集
                </button>
              ))}
              <div className="flex-1" />
              <span className="text-xs text-[#8B8E96]">{epSubs.length} 条字幕</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-white/[0.04]">
                {epSubs.map(sub => (
                  <div key={sub.id} className="px-4 md:px-5 py-3 flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                    <div className="flex items-center gap-3 md:contents">
                      <div className="md:w-16 md:flex-shrink-0">
                        <p className="text-[12px] font-mono text-[#8B8E96]">
                          {sub.startTime.toString().padStart(2, '0')}s–{sub.endTime.toString().padStart(2, '0')}s
                        </p>
                      </div>
                      <div className="md:w-16 md:flex-shrink-0">
                        <Badge variant={sub.character === '旁白' ? 'info' : 'violet'}>
                          {sub.character}
                        </Badge>
                      </div>
                      <button
                        onClick={() => setEditingSubId(editingSubId === sub.id ? null : sub.id)}
                        className="md:hidden ml-auto text-[#8B8E96] hover:text-[#F06292] transition-colors p-1 flex-shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingSubId === sub.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="flex-1 bg-white/[0.06] border border-[#EC407A]/40 rounded px-2 py-1 text-xs text-[#EDEEF0] outline-none"
                            value={subTexts[sub.id]}
                            onChange={e => setSubTexts(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          />
                          <button onClick={() => saveSubtitle(sub.id)} className="text-emerald-400 hover:text-emerald-300 p-1">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-[#EDEEF0] leading-relaxed">{subTexts[sub.id]}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingSubId(editingSubId === sub.id ? null : sub.id)}
                      className="hidden md:block text-[#8B8E96] hover:text-[#F06292] transition-colors p-1 flex-shrink-0"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Action bar ──────────────────────────────────────────── */}
      <ActionBar>
        <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'PREV_STEP' })} className="md:hidden flex-shrink-0" aria-label="上一步">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })} className="hidden md:inline-flex">
          <ArrowLeft className="w-4 h-4" />
          上一步
        </Button>
        <Button onClick={() => dispatch({ type: 'GENERATE_VOICE' })} disabled={!voiceGenerated} className="flex-1 md:flex-initial">
          <span className="md:hidden">下一步：剪辑合成</span>
          <span className="hidden md:inline">配音完成，开始剪辑合成</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </ActionBar>
    </div>
  )
}
