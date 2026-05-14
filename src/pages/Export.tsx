import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Film, CheckCircle2, Loader2, ArrowLeft, Sparkles, FileVideo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import { MOCK_EPISODES } from '@/data/mockData'
import { sleep } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { gridContainerVariants, listItemVariants, panelRevealVariants } from '@/lib/animations'

type ExportRange = 'all' | 'ep1' | 'ep2' | 'ep3'

const EXPORT_PHASES = [
  '准备导出任务...',
  '处理视频轨道...',
  '混合音频...',
  '渲染字幕...',
  '压缩编码...',
  '生成 MP4...',
  '导出完成',
]

export function Export() {
  const { state, dispatch } = useApp()
  const { project, subtitleEnabled } = state
  const [range, setRange] = useState<ExportRange>('all')
  const [withSubtitle, setWithSubtitle] = useState(subtitleEnabled)
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportPhase, setExportPhase] = useState('')
  const [done, setDone] = useState(false)

  const selectedEps = range === 'all'
    ? MOCK_EPISODES
    : MOCK_EPISODES.filter(ep => ep.id === range)

  async function handleExport() {
    setExporting(true)
    setDone(false)
    for (let i = 0; i < EXPORT_PHASES.length; i++) {
      setExportPhase(EXPORT_PHASES[i])
      setExportProgress(((i + 1) / EXPORT_PHASES.length) * 100)
      await sleep(500)
    }
    setExporting(false)
    setDone(true)
    dispatch({ type: 'COMPLETE_EXPORT' })
  }

  return (
    <PageLayout title="导出视频" description="导出最终成片，选择导出范围和字幕选项">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {/* Two-column layout: settings left, status right */}
          <div className="px-4 md:px-5 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-start max-w-5xl">

            {/* LEFT: Settings + Preview — hidden on mobile during export/done so status is the focus */}
            <div className={cn('space-y-5', (exporting || done) && 'hidden md:block')}>
              {/* Settings card */}
              <motion.div
                variants={panelRevealVariants}
                initial="hidden"
                animate="show"
                className="bg-[#1F2330] border border-white/[0.06] rounded-2xl p-5"
              >
                <p className="text-[12px] text-[#5E6068] uppercase tracking-widest font-medium mb-4">导出设置</p>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">导出范围</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {([
                        { value: 'all', label: '全部剧集' },
                        { value: 'ep1', label: '第 1 集' },
                        { value: 'ep2', label: '第 2 集' },
                        { value: 'ep3', label: '第 3 集' },
                      ] as { value: ExportRange; label: string }[]).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setRange(opt.value)}
                          className={cn(
                            'py-2 px-3 rounded-lg text-xs font-medium border transition-all',
                            range === opt.value
                              ? 'bg-[#E91E63]/20 border-[#EC407A]/40 text-[#F48FB1]'
                              : 'bg-white/[0.03] border-white/[0.06] text-[#B4B7BE] hover:border-white/[0.1]'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="block mb-0.5">字幕</Label>
                      <p className="text-[12px] text-[#8B8E96]">导出带字幕版本</p>
                    </div>
                    <Switch checked={withSubtitle} onCheckedChange={setWithSubtitle} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><Label className="block mb-0.5">格式</Label><p className="text-[12px] text-[#8B8E96]">输出格式</p></div>
                    <Badge variant="muted">MP4 (H.264)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><Label className="block mb-0.5">比例</Label><p className="text-[12px] text-[#8B8E96]">视频画面比例</p></div>
                    <Badge variant="muted">9:16 竖屏</Badge>
                  </div>
                </div>
              </motion.div>

              {/* Preview list */}
              <motion.div
                variants={panelRevealVariants}
                initial="hidden"
                animate="show"
                className="bg-[#1F2330] border border-white/[0.06] rounded-2xl p-5"
              >
                <p className="text-[12px] text-[#5E6068] uppercase tracking-widest font-medium mb-4">导出预览</p>
                <motion.div
                  className="space-y-2"
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {selectedEps.map(ep => (
                    <motion.div
                      key={ep.id}
                      variants={listItemVariants}
                      className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <FileVideo className="w-4 h-4 text-[#B4B7BE]" />
                        <div>
                          <p className="text-xs text-[#EDEEF0] font-medium">{project?.name ?? '作品'} · 第 {ep.num} 集</p>
                          <p className="text-[12px] text-[#8B8E96] mt-0.5">{ep.title} · {ep.totalDuration}s · {withSubtitle ? '带字幕' : '无字幕'}</p>
                        </div>
                      </div>
                      <div className="text-[12px] text-[#B4B7BE]">~{Math.round(ep.totalDuration * 0.8)}MB</div>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-[#B4B7BE]">共 {selectedEps.length} 个文件</span>
                  <span className="text-[#EDEEF0] font-medium">约 {Math.round(selectedEps.reduce((s, ep) => s + ep.totalDuration * 0.8, 0))}MB</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Status panel — always visible, shows idle / exporting / done */}
            <motion.div
              variants={panelRevealVariants}
              initial="hidden"
              animate="show"
              className="sticky top-6"
            >
              <AnimatePresence mode="wait">
                {!exporting && !done && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#1F2330] border border-white/[0.06] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[260px]"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#E91E63]/10 border border-[#EC407A]/20 flex items-center justify-center">
                      <Film className="w-7 h-7 text-[#F06292]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#EDEEF0] mb-1">准备导出</p>
                      <p className="text-xs text-[#B4B7BE]">确认设置后，点击下方「导出 MP4」按钮开始</p>
                    </div>
                  </motion.div>
                )}

                {exporting && (
                  <motion.div
                    key="exporting"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#1F2330] border border-[#EC407A]/25 rounded-2xl p-6 min-h-[260px] flex flex-col justify-center gap-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E91E63]/10 flex items-center justify-center flex-shrink-0">
                        <Loader2 className="w-5 h-5 text-[#F06292] animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#EDEEF0]">正在导出视频…</p>
                        <p className="text-xs text-[#B4B7BE] mt-0.5">{exportPhase}</p>
                      </div>
                    </div>
                    <div>
                      <Progress value={exportProgress} />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-[#B4B7BE]">处理中</span>
                        <span className="text-xs text-[#F48FB1] font-medium">{Math.round(exportProgress)}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {EXPORT_PHASES.slice(0, Math.ceil(exportProgress / 100 * EXPORT_PHASES.length)).map((ph, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#B4B7BE]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          {ph}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {done && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/[0.06] border border-emerald-500/25 rounded-2xl p-6 min-h-[260px] flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#EDEEF0]">导出完成！</p>
                        <p className="text-xs text-[#B4B7BE]">《{project?.name}》· {selectedEps.length} 集</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {selectedEps.map(ep => (
                        <button
                          key={ep.id}
                          className="flex items-center gap-3 w-full px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-xl transition-all text-left group"
                        >
                          <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs text-emerald-300 flex-1">{ep.title}.mp4</span>
                          <span className="text-[12px] text-emerald-500/60">~{Math.round(ep.totalDuration * 0.8)}MB</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-[#E91E63]/[0.06] border border-[#EC407A]/15 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-[#F06292] flex-shrink-0" />
                      <p className="text-xs text-[#F48FB1]">全流程完成！下一部杰作，从上传剧本开始。</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
          {done ? (
            <Button variant="success" className="flex-1 md:flex-initial">
              <Download className="w-4 h-4" />
              下载全部视频
            </Button>
          ) : (
            <Button size="lg" onClick={handleExport} disabled={exporting} className="shadow-lg shadow-[#880E4F]/20 flex-1 md:flex-initial">
              <Film className="w-5 h-5" />
              {exporting ? '导出中...' : '导出 MP4'}
            </Button>
          )}
        </ActionBar>
      </div>
    </PageLayout>
  )
}
