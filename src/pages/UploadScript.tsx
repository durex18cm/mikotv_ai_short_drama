import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ImagePlus, X, RefreshCw, Sparkles, ArrowLeft, ArrowRight,
  Check, Plus, Wand2, CheckCircle2, Info,
} from 'lucide-react'
import type { Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import { cn, sleep } from '@/lib/utils'
import { panelRevealVariants } from '@/lib/animations'

const enterEase = [0.16, 1, 0.3, 1] as const

const chipContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.028,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.012,
      staggerDirection: -1,
    },
  },
}

const chipItemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: enterEase },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.96,
    transition: { duration: 0.14, ease: enterEase },
  },
}

interface DramaType {
  id: string
  name: string
  subcategories: string[]
  appeals: string[]
}

const DRAMA_TYPES: DramaType[] = [
  { id: 'urban', name: '都市', subcategories: ['霸总', '豪门', '职场', '商战'], appeals: ['阶层差', '身份反转', '打脸'] },
  { id: 'romance', name: '爱情', subcategories: ['甜宠', '虐恋', '追妻', '替嫁'], appeals: ['情绪拉扯', '误会', '重逢'] },
  { id: 'ancient', name: '古装', subcategories: ['宫斗', '宅斗', '权谋', '王妃', '军事'], appeals: ['身份压迫', '复仇', '权力博弈', '雄图伟略'] },
  { id: 'travel', name: '穿越', subcategories: ['穿书', '穿古', '系统', '种田'], appeals: ['降维打击', '改命', '反套路'] },
  { id: 'rebirth', name: '重生', subcategories: ['重生复仇', '重生改命'], appeals: ['信息差', '虐渣', '弥补遗憾'] },
  { id: 'counter', name: '逆袭', subcategories: ['赘婿', '神豪', '战神', '神医'], appeals: ['低开高走', '打脸', '扬眉吐气'] },
  { id: 'family', name: '家庭', subcategories: ['婆媳', '认亲', '真假千金'], appeals: ['现实共鸣', '亲情', '伦理冲突'] },
  { id: 'mystery', name: '悬疑', subcategories: ['刑侦', '家庭悬疑', '复仇悬疑'], appeals: ['真相', '反转', '秘密'] },
  { id: 'fantasy', name: '玄幻', subcategories: ['修仙', '异能', '系统'], appeals: ['升级', '觉醒', '战力碾压'] },
  { id: 'campus', name: '校园', subcategories: ['暗恋', '青春', '校霸', '学霸'], appeals: ['初恋', '成长', '青春遗憾'] },
]

const GENERATION_PHASES = [
  { label: '分析参考图风格…', duration: 480 },
  { label: '构思人设与背景…', duration: 540 },
  { label: '拆解剧集与场景…', duration: 600 },
  { label: '生成台词与旁白…', duration: 780 },
  { label: '输出结构化剧本…', duration: 600 },
]

type Phase = 'idle' | 'generating' | 'done'

export function UploadScript() {
  const { state, dispatch } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const subSectionRef = useRef<HTMLDivElement>(null)

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [appeals, setAppeals] = useState<string[]>([])
  const [customSub, setCustomSub] = useState('')
  const [customAppeal, setCustomAppeal] = useState('')

  const [phase, setPhase] = useState<Phase>('idle')
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  const activeType = useMemo(
    () => DRAMA_TYPES.find(t => t.id === selectedType) ?? null,
    [selectedType]
  )

  function pickImage() {
    fileInputRef.current?.click()
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImageUrl(typeof ev.target?.result === 'string' ? ev.target.result : null)
    reader.readAsDataURL(file)
    // reset so re-selecting the same file fires onChange
    e.target.value = ''
  }

  function clearImage() {
    setImageUrl(null)
  }

  function selectType(id: string) {
    if (selectedType === id) return
    setSelectedType(id)
    setSubcategories([])
    setAppeals([])
    setCustomSub('')
    setCustomAppeal('')
  }

  // Mobile: scroll subcategory section into view after the section actually mounts.
  // AnimatePresence mode="wait" delays mount until the empty-state exit completes,
  // so we poll via rAF until the ref is attached (works for both first and subsequent clicks).
  useEffect(() => {
    if (!selectedType) return
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 767px)').matches) return

    let cancelled = false
    let frames = 0
    const maxFrames = 60 // ~1s safety cap
    const tryScroll = () => {
      if (cancelled) return
      const node = subSectionRef.current
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (frames < maxFrames) {
        frames++
        requestAnimationFrame(tryScroll)
      }
    }
    requestAnimationFrame(tryScroll)
    return () => { cancelled = true }
  }, [selectedType])

  function toggleSub(tag: string) {
    setSubcategories(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }
  function toggleAppeal(tag: string) {
    setAppeals(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }
  function addCustomSub() {
    const v = customSub.trim()
    if (!v || subcategories.includes(v)) return
    setSubcategories(prev => [...prev, v])
    setCustomSub('')
  }
  function addCustomAppeal() {
    const v = customAppeal.trim()
    if (!v || appeals.includes(v)) return
    setAppeals(prev => [...prev, v])
    setCustomAppeal('')
  }

  const canGenerate = !!selectedType && subcategories.length > 0 && appeals.length > 0

  async function handleGenerate() {
    if (!canGenerate || phase === 'generating') return
    setPhase('generating')
    setPhaseIdx(0)
    setProgress(0)

    const total = GENERATION_PHASES.reduce((s, p) => s + p.duration, 0)
    let elapsed = 0
    for (let i = 0; i < GENERATION_PHASES.length; i++) {
      setPhaseIdx(i)
      const stepMs = GENERATION_PHASES[i].duration
      const stepStart = elapsed
      const stepEnd = elapsed + stepMs
      // animate progress smoothly within this phase
      const ticks = Math.max(6, Math.floor(stepMs / 60))
      for (let k = 1; k <= ticks; k++) {
        await sleep(stepMs / ticks)
        const inStep = (k / ticks) * stepMs
        setProgress(Math.min(100, ((stepStart + inStep) / total) * 100))
      }
      elapsed = stepEnd
    }
    setProgress(100)

    // Fetch the real script in the background to seed the state
    try {
      const filename = encodeURIComponent('《霍去病之封狼居胥》.md')
      const text = await fetch(`/scripts/${filename}`).then(r => r.text())
      dispatch({ type: 'SET_SCRIPT', content: text })
    } catch {
      // fallback: existing scriptContent is fine
    }
    dispatch({ type: 'PARSE_SCRIPT' })
    setPhase('done')
  }

  function goToEdit() {
    // Advance from step 2 → step 3 (剧本解析)
    dispatch({ type: 'NEXT_STEP' })
  }

  // reset done-phase when revisiting (e.g., user navigates back)
  useEffect(() => {
    if (state.currentStep !== 2 && phase === 'done') {
      setPhase('idle')
      setProgress(0)
    }
  }, [state.currentStep, phase])

  return (
    <PageLayout
      title="选择短剧类型"
      description="上传参考图（可选），选择类型与爽点，AI 自动生成剧本"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full grid grid-cols-1 md:grid-cols-[340px_1fr] md:divide-x divide-white/[0.05] overflow-y-auto md:overflow-hidden"
              >
                {/* Left: image upload */}
                <div className="flex flex-col p-4 md:p-5 gap-4 md:overflow-y-auto border-b md:border-b-0 border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4 text-[#B4B7BE]" />
                    <span className="text-xs font-medium text-[#D2D5DB]">参考图</span>
                    <span className="text-[12px] text-[#5E6068]">可选 · 最多 1 张</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFile}
                  />

                  {imageUrl ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#12151C] group">
                        <img src={imageUrl} alt="参考图" className="w-full aspect-video md:aspect-[9/16] object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <button
                            onClick={pickImage}
                            className="h-7 px-2.5 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 text-[12px] text-white/90 hover:bg-black/70 flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            更换
                          </button>
                          <button
                            onClick={clearImage}
                            className="h-7 w-7 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-black/70 flex items-center justify-center"
                            aria-label="删除"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#8B8E96] leading-relaxed">
                        AI 将参考此图的画面风格、人物造型与色调，生成贴合的剧本与镜头描述。
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={pickImage}
                        className="group relative aspect-video md:aspect-[9/16] rounded-xl border border-dashed border-white/[0.12] hover:border-[#EC407A]/50 bg-white/[0.02] hover:bg-[#E91E63]/[0.04] transition-colors flex flex-col items-center justify-center gap-3 text-center px-6"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-[#EC407A]/40 group-hover:bg-[#E91E63]/10 transition-colors">
                          <ImagePlus className="w-5 h-5 text-[#8B8E96] group-hover:text-[#F06292]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#D2D5DB]">点击上传参考图</p>
                          <p className="text-[12px] text-[#5E6068] mt-1">JPG / PNG · 单张</p>
                        </div>
                      </button>
                      <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3 flex gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] text-amber-200/90 leading-relaxed">
                          未上传参考图，AI 将仅根据你选择的类型自动生成剧本风格与人物造型。
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Right: type selection */}
                <div className="flex flex-col md:overflow-y-auto">
                  <div className="px-4 py-4 md:px-6 md:py-5 space-y-5 md:space-y-6">
                    {/* Type */}
                    <section>
                      <SectionHeader
                        index={1}
                        title="选择类型"
                        hint="单选 · 决定故事大方向"
                      />
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                        {DRAMA_TYPES.map(t => {
                          const active = selectedType === t.id
                          return (
                            <button
                              key={t.id}
                              onClick={() => selectType(t.id)}
                              className={cn(
                                'h-10 rounded-lg border text-sm font-medium transition-all duration-150',
                                active
                                  ? 'bg-[#E91E63]/[0.12] border-[#EC407A]/60 text-[#F48FB1] shadow-sm shadow-[#880E4F]/30'
                                  : 'bg-white/[0.02] border-white/[0.06] text-[#D2D5DB] hover:bg-white/[0.05] hover:border-white/[0.12]'
                              )}
                            >
                              {t.name}
                            </button>
                          )
                        })}
                      </div>
                    </section>

                    <AnimatePresence mode="wait" initial={false}>
                      {activeType ? (
                        <motion.div
                          key="sections"
                          ref={subSectionRef}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="space-y-6 scroll-mt-2"
                        >
                          {/* Subcategory */}
                          <motion.section variants={panelRevealVariants}>
                            <SectionHeader
                              index={2}
                              title="高频细分"
                              hint="多选 · 可同时勾选多个标签"
                            />
                            <ChipGroup
                              groupKey={`sub-${activeType.id}`}
                              presets={activeType.subcategories}
                              selected={subcategories}
                              onToggle={toggleSub}
                            />
                            <CustomInput
                              value={customSub}
                              onChange={setCustomSub}
                              onAdd={addCustomSub}
                              placeholder="不满意？追加自定义细分，如「双胞胎」"
                            />
                          </motion.section>

                          {/* Appeals */}
                          <motion.section variants={panelRevealVariants}>
                            <SectionHeader
                              index={3}
                              title="核心爽点"
                              hint="多选 · AI 会围绕这些爽点编排剧情冲突"
                            />
                            <ChipGroup
                              groupKey={`appeal-${activeType.id}`}
                              presets={activeType.appeals}
                              selected={appeals}
                              onToggle={toggleAppeal}
                            />
                            <CustomInput
                              value={customAppeal}
                              onChange={setCustomAppeal}
                              onAdd={addCustomAppeal}
                              placeholder="不满意？追加自定义爽点，如「逆风翻盘」"
                            />
                          </motion.section>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          variants={panelRevealVariants}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] px-5 py-10 text-center"
                        >
                          <p className="text-xs text-[#8B8E96]">先选择一个「类型」</p>
                          <p className="text-[12px] text-[#5E6068] mt-1">类型决定后续可选的高频细分与核心爽点</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center px-6"
              >
                <div className="w-full max-w-xl">
                  <div className="flex flex-col items-center text-center gap-5 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-[#E91E63]/30 blur-2xl animate-pulse" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E91E63] to-[#9C27B0] flex items-center justify-center shadow-xl shadow-[#880E4F]/40">
                        <Wand2 className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#EDEEF0]">AI 正在为你生成剧本</p>
                      <p className="text-xs text-[#8B8E96] mt-1">
                        类型 · {activeType?.name} ｜ 细分 {subcategories.length} 项 ｜ 爽点 {appeals.length} 项
                      </p>
                    </div>
                  </div>

                  <Progress value={progress} className="mb-5" />

                  <div className="space-y-2">
                    {GENERATION_PHASES.map((p, i) => {
                      const done = i < phaseIdx
                      const active = i === phaseIdx
                      return (
                        <motion.div
                          key={p.label}
                          initial={false}
                          animate={{ opacity: done || active ? 1 : 0.35 }}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span
                            className={cn(
                              'w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
                              done
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : active
                                ? 'bg-[#E91E63]/20 text-[#F06292]'
                                : 'bg-white/[0.04] text-[#5E6068]'
                            )}
                          >
                            {done ? (
                              <Check className="w-3 h-3" />
                            ) : active ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#EC407A] animate-pulse" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#5E6068]" />
                            )}
                          </span>
                          <span
                            className={cn(
                              'transition-colors',
                              active ? 'text-[#F48FB1] font-medium' : done ? 'text-[#D2D5DB]' : 'text-[#5E6068]'
                            )}
                          >
                            {p.label}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex items-center justify-center px-6"
              >
                <div className="w-full max-w-md text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 mb-5"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-[#EDEEF0]">生成完成</h3>
                  <p className="text-xs text-[#B4B7BE] mt-2 leading-relaxed">
                    AI 已根据你选择的「{activeType?.name}」类型与爽点，生成 3 集结构化剧本。
                    <br />
                    点击下方按钮进入编辑页，可逐镜头微调台词与画面描述。
                  </p>
                  <Button
                    size="lg"
                    onClick={goToEdit}
                    className="mt-6 px-6"
                  >
                    <Sparkles className="w-4 h-4" />
                    点击进入编辑
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ActionBar>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            disabled={phase === 'generating'}
            className="md:hidden flex-shrink-0"
            aria-label="上一步"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            disabled={phase === 'generating'}
            className="hidden md:inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
            {phase === 'idle' && (
              <>
                <div className="hidden md:block">
                  <SummaryHint
                    type={activeType?.name}
                    sub={subcategories.length}
                    appeal={appeals.length}
                  />
                </div>
                <Button onClick={handleGenerate} disabled={!canGenerate} className="flex-1 md:flex-initial">
                  <Wand2 className="w-4 h-4" />
                  AI 生成剧本
                </Button>
              </>
            )}
            {phase === 'generating' && (
              <Button disabled className="flex-1 md:flex-initial">
                <Wand2 className="w-4 h-4 animate-pulse" />
                生成中…
              </Button>
            )}
            {phase === 'done' && (
              <Button onClick={goToEdit} className="flex-1 md:flex-initial">
                进入剧本编辑
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </ActionBar>
      </div>
    </PageLayout>
  )
}

function SectionHeader({ index, title, hint }: { index: number; title: string; hint: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[12px] text-[#5E6068] font-mono tabular-nums">{String(index).padStart(2, '0')}</span>
      <span className="text-sm font-semibold text-[#EDEEF0]">{title}</span>
      <span className="text-[12px] text-[#5E6068]">{hint}</span>
    </div>
  )
}

function TagChip({
  label,
  active,
  custom,
  onClick,
}: {
  label: string
  active: boolean
  custom?: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      layout
      variants={chipItemVariants}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        'h-8 px-3 rounded-full border text-xs font-medium transition-colors duration-150 inline-flex items-center gap-1.5',
        active
          ? 'bg-[#E91E63]/[0.14] border-[#EC407A]/50 text-[#F48FB1]'
          : 'bg-white/[0.03] border-white/[0.08] text-[#D2D5DB] hover:bg-white/[0.06] hover:border-white/[0.14]'
      )}
    >
      {active && <Check className="w-3 h-3" />}
      <span>{label}</span>
      {custom && (
        <span className="text-[11px] text-[#F8BBD0]/60 ml-0.5">自定义</span>
      )}
    </motion.button>
  )
}

function ChipGroup({
  groupKey,
  presets,
  selected,
  onToggle,
}: {
  groupKey: string
  presets: string[]
  selected: string[]
  onToggle: (tag: string) => void
}) {
  const customs = selected.filter(t => !presets.includes(t))
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={groupKey}
        variants={chipContainerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-wrap gap-2 mt-3"
      >
        {presets.map(tag => (
          <TagChip
            key={tag}
            label={tag}
            active={selected.includes(tag)}
            onClick={() => onToggle(tag)}
          />
        ))}
        {customs.map(tag => (
          <TagChip
            key={`custom-${tag}`}
            label={tag}
            active
            custom
            onClick={() => onToggle(tag)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

function CustomInput({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onAdd: () => void
  placeholder: string
}) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAdd()
            }
          }}
          placeholder={placeholder}
          className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#EDEEF0] placeholder:text-[#5E6068] focus:outline-none focus:border-[#EC407A]/40 focus:bg-white/[0.05] transition-colors"
        />
      </div>
      <Button
        size="sm"
        variant="secondary"
        onClick={onAdd}
        disabled={!value.trim()}
      >
        <Plus className="w-3 h-3" />
        追加
      </Button>
    </div>
  )
}

function SummaryHint({
  type,
  sub,
  appeal,
}: {
  type: string | undefined
  sub: number
  appeal: number
}) {
  if (!type) {
    return <span className="text-[12px] text-[#5E6068]">请先选择类型与至少一个爽点</span>
  }
  const ready = sub > 0 && appeal > 0
  return (
    <span className={cn('text-[12px]', ready ? 'text-[#B4B7BE]' : 'text-[#5E6068]')}>
      {type} · 细分 {sub} ｜ 爽点 {appeal}
    </span>
  )
}
