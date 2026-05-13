import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Cpu, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import { sleep } from '@/lib/utils'

const PARSE_PHASES = [
  '正在解析剧本结构...',
  '正在识别集数与场景...',
  '正在分析人物关系...',
  '正在拆分镜头...',
  '正在提取台词与旁白...',
  '生成结构化数据...',
]

export function UploadScript() {
  const { state, dispatch } = useApp()
  const [content, setContent] = useState(state.scriptContent)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState(state.scriptParsed)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  // Load the real script file from public/ on first mount
  useEffect(() => {
    const filename = encodeURIComponent('《霍去病之封狼居胥》.md')
    fetch(`/scripts/${filename}`)
      .then(r => r.text())
      .then(text => { setContent(text); dispatch({ type: 'SET_SCRIPT', content: text }) })
      .catch(() => {}) // fallback to existing content if fetch fails
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wordCount = content.trim().length
  const lineCount = content.split('\n').filter(l => l.trim()).length

  async function handleParse() {
    setParsing(true)
    setParsed(false)
    dispatch({ type: 'SET_SCRIPT', content })

    for (let i = 0; i < PARSE_PHASES.length; i++) {
      setPhaseIdx(i)
      setProgress(((i + 1) / PARSE_PHASES.length) * 100)
      await sleep(600)
    }

    setParsing(false)
    setParsed(true)
    dispatch({ type: 'PARSE_SCRIPT' })
  }

  function handleNext() {
    dispatch({ type: 'CONFIRM_SCRIPT' })
  }

  return (
    <PageLayout title="上传剧本" description="粘贴你的短剧剧本，AI 将自动完成解析">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-[1fr_320px] divide-x divide-white/[0.05]">
            {/* Left: editor */}
            <div className="flex flex-col p-5 gap-3 overflow-hidden">
              <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#B4B7BE]" />
                  <span className="text-xs font-medium text-[#D2D5DB]">剧本文本</span>
                </div>
                <div className="flex items-center gap-3 text-[13px] text-[#8B8E96]">
                  <span>{wordCount.toLocaleString()} 字</span>
                  <span>{lineCount} 行</span>
                </div>
              </div>
              <Textarea
                className="flex-1 font-mono text-[13px] leading-relaxed resize-none"
                placeholder={`第一集：漠南之战\n\n场景一：大汉军营，夜\n\n旁白：元朔六年...\n\n霍去病：八百轻骑，随我深入漠南！`}
                value={content}
                onChange={e => { setContent(e.target.value); setParsed(false) }}
              />
            </div>

            {/* Right: analysis */}
            <div className="flex flex-col p-5 gap-4 overflow-y-auto bg-[#0F1219]/50">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Cpu className="w-4 h-4 text-[#B4B7BE]" />
                <span className="text-xs font-medium text-[#D2D5DB]">AI 解析</span>
              </div>

              <AnimatePresence mode="wait">
                {parsing ? (
                  <motion.div
                    key="parsing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <Progress value={progress} />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={phaseIdx}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-[#F48FB1] flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EC407A] animate-pulse" />
                        {PARSE_PHASES[phaseIdx]}
                      </motion.div>
                    </AnimatePresence>
                    <div className="space-y-2">
                      {PARSE_PHASES.slice(0, phaseIdx + 1).map((phase, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#B4B7BE]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span>{phase}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : parsed ? (
                  <motion.div
                    key="parsed"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium">解析完成</span>
                    </div>

                    <div className="bg-[#12151C] border border-white/[0.06] rounded-xl p-4 space-y-3">
                      <p className="text-[12px] text-[#5E6068] uppercase tracking-widest font-medium">识别结果</p>
                      {[
                        ['剧集数量', '3 集'],
                        ['场景数量', '12 个场景'],
                        ['主要角色', '5 个角色'],
                        ['镜头数量', '15 个镜头'],
                        ['台词总计', '28 句台词'],
                        ['旁白段落', '9 段旁白'],
                        ['预计时长', '约 240 秒'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="text-xs text-[#B4B7BE]">{k}</span>
                          <span className="text-xs font-semibold text-[#EDEEF0]">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[13px] text-emerald-300 leading-relaxed">
                          剧本格式清晰，AI 识别了 3 集完整的故事结构，
                          可以进入角色确认阶段。
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center gap-3 py-12"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-[#5E6068]" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#B4B7BE]">点击「解析剧本」</p>
                      <p className="text-[13px] text-[#5E6068] mt-1">AI 将自动拆分集数、场景和镜头</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              onClick={handleParse}
              disabled={!content.trim() || parsing}
            >
              <Cpu className="w-4 h-4" />
              {parsing ? '解析中...' : '解析剧本'}
            </Button>
            <Button onClick={handleNext} disabled={!parsed}>
              下一步：确认角色
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
