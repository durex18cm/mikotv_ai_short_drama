import { Badge } from '@/components/ui/badge'
import type { GenStatus, StepStatus, SynthesisStatus } from '@/types'

const GEN_CONFIG: Record<GenStatus, { label: string; variant: 'default' | 'violet' | 'success' | 'warning' | 'danger' | 'info' | 'muted'; dot: boolean }> = {
  idle: { label: '未生成', variant: 'muted', dot: false },
  queued: { label: '排队中', variant: 'info', dot: true },
  generating: { label: '生成中', variant: 'violet', dot: true },
  done: { label: '已生成', variant: 'success', dot: true },
  failed: { label: '生成失败', variant: 'danger', dot: true },
  locked: { label: '已锁定', variant: 'warning', dot: true },
}

const STEP_CONFIG: Record<StepStatus, { label: string; variant: 'default' | 'violet' | 'success' | 'warning' | 'danger' | 'info' | 'muted' }> = {
  pending: { label: '未开始', variant: 'muted' },
  active: { label: '进行中', variant: 'violet' },
  completed: { label: '已完成', variant: 'success' },
}

const SYNTHESIS_CONFIG: Record<SynthesisStatus, { label: string; variant: 'default' | 'violet' | 'success' | 'warning' | 'danger' | 'info' | 'muted'; dot: boolean }> = {
  idle: { label: '未合成', variant: 'muted', dot: false },
  generating: { label: '合成中', variant: 'violet', dot: true },
  done: { label: '合成完成', variant: 'success', dot: true },
  failed: { label: '合成失败', variant: 'danger', dot: true },
}

export function GenStatusBadge({ status }: { status: GenStatus }) {
  const cfg = GEN_CONFIG[status]
  return <Badge variant={cfg.variant} dot={cfg.dot}>{cfg.label}</Badge>
}

export function StepStatusBadge({ status }: { status: StepStatus }) {
  const cfg = STEP_CONFIG[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

export function SynthesisStatusBadge({ status }: { status: SynthesisStatus }) {
  const cfg = SYNTHESIS_CONFIG[status]
  return <Badge variant={cfg.variant} dot={cfg.dot}>{cfg.label}</Badge>
}
