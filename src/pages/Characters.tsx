import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Edit3, RotateCcw, ArrowRight, ArrowLeft, Users, Volume2 } from 'lucide-react'
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
import { useApp } from '@/context/AppContext'
import { getCharacterImageUrl, getCharacterAvatarPosition } from '@/data/mockData'
import type { Character } from '@/types'
import { cn } from '@/lib/utils'
import { gridContainerVariants, gridItemVariants } from '@/lib/animations'

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
        'bg-[#111128] border rounded-2xl p-5 transition-all duration-200',
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
            <h3 className="font-semibold text-[#ededff] text-sm">{character.name}</h3>
            {character.confirmed && (
              <span>
                <Badge variant="success" dot>已确认</Badge>
              </span>
            )}
          </div>
          <p className="text-xs text-[#c8c8e0]">{character.age} · {character.role}</p>
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
            <span className="text-[12px] text-[#ababc8] w-8 flex-shrink-0 pt-0.5">{item.label}</span>
            <span className="text-[13px] text-[#d8d8ec] leading-snug">{item.value}</span>
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
  const confirmedCount = characters.filter(c => c.confirmed).length

  function confirmAll() {
    dispatch({ type: 'CONFIRM_CHARACTERS' })
  }

  return (
    <PageLayout
      title="确认角色"
      description="AI 已自动识别角色并生成设定，确认后将用于所有镜头生成"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4">
            {/* Stats bar */}
            <div className="flex items-center gap-4 mb-5 p-3 bg-[#0d0d1f] border border-white/[0.04] rounded-xl">
              <Users className="w-4 h-4 text-[#b8b8cc]" />
              <span className="text-xs text-[#c8c8e0]">共识别到 {characters.length} 个角色</span>
              <span className="flex-1" />
              <span className="text-xs text-[#ededff] font-medium">{confirmedCount}</span>
              <span className="text-xs text-[#b8b8cc]">/ {characters.length} 已确认</span>
              <div className="w-24 h-1 bg-white/[0.06] rounded-full overflow-hidden">
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
          <Button variant="ghost" onClick={() => dispatch({ type: 'PREV_STEP' })}>
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => characters.forEach(c => dispatch({ type: 'UPDATE_CHARACTER', character: { ...c, confirmed: false } }))}
            >
              <RotateCcw className="w-4 h-4" />
              重新生成
            </Button>
            <Button onClick={confirmAll}>
              确认全部角色
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
