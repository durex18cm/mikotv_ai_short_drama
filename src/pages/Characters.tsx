import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Edit3, RotateCcw, ArrowRight, ArrowLeft, Users, Volume2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogBody, DialogFooter,
} from '@/components/ui/dialog'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { CharacterAvatar } from '@/components/shared/ImagePlaceholder'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/context/AppContext'
import { getCharacterImageUrl, getCharacterAvatarPosition } from '@/data/mockData'
import type { Character } from '@/types'
import { cn, sleep } from '@/lib/utils'
import { gridContainerVariants, gridItemVariants } from '@/lib/animations'

const REGEN_PHASES = [
  '清空已确认状态…',
  '基于剧本重新提取角色…',
  '生成最新角色设定…',
]

function CharacterCard({
  character,
  onEdit,
}: {
  character: Character
  onEdit: (c: Character) => void
}) {
  const { dispatch } = useApp()

  function toggleConfirm() {
    dispatch({ type: 'UPDATE_CHARACTER', character: { ...character, confirmed: !character.confirmed } })
  }

  return (
    <div
      className={cn(
        'bg-[#1F2330] border rounded-2xl p-5 transition-all duration-200',
        character.confirmed
          ? 'border-emerald-500/30 shadow-sm shadow-emerald-500/5'
          : 'border-white/[0.06] hover:border-white/[0.1]'
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <CharacterAvatar
          name={character.name}
          colorHue={character.colorHue}
          size="lg"
          imageUrl={getCharacterImageUrl(character.name)}
          imagePosition={getCharacterAvatarPosition(character.name)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-[#EDEEF0] text-sm">{character.name}</h3>
            {character.confirmed && (
              <span>
                <Badge variant="success" dot>已确认</Badge>
              </span>
            )}
          </div>
          <p className="text-xs text-[#B4B7BE]">{character.age} · {character.role}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {[
          { label: '外貌', value: character.appearance },
          { label: '服装', value: character.costume },
          { label: '性格', value: character.personality },
          { label: '声音', value: character.voiceDesc },
        ].map(item => (
          <div key={item.label} className="flex gap-2">
            <span className="text-[12px] text-[#8B8E96] w-8 flex-shrink-0 pt-0.5">{item.label}</span>
            <span className="text-[13px] text-[#D2D5DB] leading-snug">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(character)}
        >
          <Edit3 className="w-3 h-3" />
          编辑
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={toggleConfirm}
        >
          {character.confirmed ? (
            <><Check className="w-3 h-3 text-emerald-400" /> 已确认</>
          ) : (
            <><Check className="w-3 h-3" /> 确认</>
          )}
        </Button>
      </div>
    </div>
  )
}

function EditDialog({
  character,
  open,
  onClose,
}: {
  character: Character | null
  open: boolean
  onClose: () => void
}) {
  const { dispatch } = useApp()
  const [form, setForm] = useState<Character | null>(character)

  if (!form) return null

  function save() {
    if (!form) return
    dispatch({ type: 'UPDATE_CHARACTER', character: form })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <CharacterAvatar
              name={form.name}
              colorHue={form.colorHue}
              size="sm"
              imageUrl={getCharacterImageUrl(form.name)}
              imagePosition={getCharacterAvatarPosition(form.name)}
            />
            <div>
              <DialogTitle>编辑角色：{form.name}</DialogTitle>
              <DialogDescription>修改角色设定，AI 将基于此生成关键帧和视频</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="space-y-4">
          {[
            { label: '角色名称', field: 'name' as const, type: 'input' },
            { label: '年龄', field: 'age' as const, type: 'input' },
            { label: '身份', field: 'role' as const, type: 'input' },
            { label: '外貌描述', field: 'appearance' as const, type: 'textarea' },
            { label: '服装描述', field: 'costume' as const, type: 'textarea' },
            { label: '性格描述', field: 'personality' as const, type: 'textarea' },
            { label: '声音描述', field: 'voiceDesc' as const, type: 'input' },
          ].map(item => (
            <div key={item.field}>
              <Label className="mb-1.5 block">{item.label}</Label>
              {item.type === 'input' ? (
                <Input
                  value={form[item.field] as string}
                  onChange={e => setForm(f => f ? { ...f, [item.field]: e.target.value } : f)}
                />
              ) : (
                <Textarea
                  value={form[item.field] as string}
                  onChange={e => setForm(f => f ? { ...f, [item.field]: e.target.value } : f)}
                  className="min-h-[60px] text-xs"
                />
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block">声音性别</Label>
              <Select value={form.voiceGender} onChange={e => setForm(f => f ? { ...f, voiceGender: e.target.value as 'male' | 'female' } : f)}>
                <option value="male">男声</option>
                <option value="female">女声</option>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">声音年龄感</Label>
              <Select value={form.voiceAge} onChange={e => setForm(f => f ? { ...f, voiceAge: e.target.value as 'young' | 'mature' } : f)}>
                <option value="young">年轻</option>
                <option value="mature">成熟</option>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button onClick={save}>保存角色设定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Characters() {
  const { state, dispatch } = useApp()
  const { characters } = state
  const [editTarget, setEditTarget] = useState<Character | null>(null)
  const [regenerating, setRegenerating] = useState(false)
  const [regenPhase, setRegenPhase] = useState(0)
  const [regenProgress, setRegenProgress] = useState(0)
  const confirmedCount = characters.filter(c => c.confirmed).length

  function confirmAll() {
    dispatch({ type: 'CONFIRM_CHARACTERS' })
  }

  async function handleRegenerate() {
    if (regenerating) return
    setRegenerating(true)
    setRegenPhase(0)
    setRegenProgress(0)
    // Clear confirmed state immediately for visible change
    characters.forEach(c => dispatch({ type: 'UPDATE_CHARACTER', character: { ...c, confirmed: false } }))
    const total = 2000
    const stepMs = total / REGEN_PHASES.length
    for (let i = 0; i < REGEN_PHASES.length; i++) {
      setRegenPhase(i)
      const ticks = 10
      for (let k = 1; k <= ticks; k++) {
        await sleep(stepMs / ticks)
        setRegenProgress(((i + k / ticks) / REGEN_PHASES.length) * 100)
      }
    }
    setRegenProgress(100)
    setRegenerating(false)
  }

  return (
    <PageLayout
      title="确认角色"
      description="AI 已自动识别角色并生成设定，确认后将用于所有镜头生成"
    >
      <div className="flex flex-col h-full relative">
        <AnimatePresence>
          {regenerating && (
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
                    <p className="text-sm font-semibold text-[#EDEEF0]">正在重新生成角色</p>
                    <p className="text-[12px] text-[#8B8E96] mt-1">AI 将基于剧本重新提取并设定角色</p>
                  </div>
                </div>
                <Progress value={regenProgress} className="mb-4" />
                <div className="space-y-2">
                  {REGEN_PHASES.map((p, i) => {
                    const done = i < regenPhase
                    const active = i === regenPhase
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

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-5 py-4">
            {/* Stats bar */}
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-5 p-3 bg-[#181B24] border border-white/[0.04] rounded-xl">
              <Users className="w-4 h-4 text-[#B4B7BE] flex-shrink-0" />
              <span className="text-xs text-[#B4B7BE] flex-shrink-0">{characters.length} 个角色</span>
              <span className="flex-1" />
              <span className="text-xs text-[#EDEEF0] font-medium flex-shrink-0">{confirmedCount}</span>
              <span className="text-xs text-[#B4B7BE] flex-shrink-0">/ {characters.length} 已确认</span>
              <div className="w-16 md:w-24 h-1 bg-white/[0.06] rounded-full overflow-hidden flex-shrink-0">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  animate={{ width: `${(confirmedCount / characters.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              variants={gridContainerVariants}
              initial="hidden"
              animate="show"
            >
              {characters.map(char => (
                <motion.div
                  key={char.id}
                  variants={gridItemVariants}
                >
                  <CharacterCard character={char} onEdit={c => setEditTarget(c)} />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-5 flex items-center gap-2 p-3 bg-[#E91E63]/[0.06] border border-[#EC407A]/15 rounded-xl">
              <Volume2 className="w-3.5 h-3.5 text-[#F06292] flex-shrink-0" />
              <p className="text-[13px] text-[#F48FB1]">
                角色设定将自动用于关键帧生成、视频生成和配音匹配，请确保设定描述准确。
              </p>
            </div>
          </div>
        </div>

        <ActionBar>
          <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={regenerating} className="md:hidden flex-shrink-0" aria-label="上一步">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })} disabled={regenerating} className="hidden md:inline-flex">
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
            <Button variant="secondary" onClick={handleRegenerate} disabled={regenerating}>
              <RotateCcw className={cn('w-4 h-4', regenerating && 'animate-spin')} />
              {regenerating ? '生成中' : '重新生成'}
            </Button>
            <Button onClick={confirmAll} disabled={regenerating} className="flex-1 md:flex-initial">
              <span className="md:hidden">确认全部</span>
              <span className="hidden md:inline">确认全部角色</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </ActionBar>

        <EditDialog
          character={editTarget}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
        />
      </div>
    </PageLayout>
  )
}
