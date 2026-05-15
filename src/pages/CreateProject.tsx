import { useState } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import type { Project } from '@/types'

export function CreateProject() {
  const { dispatch } = useApp()
  const [form, setForm] = useState({
    name: '霍去病之封狼居胥',
    episodes: '3',
    duration: '60-90s',
    ratio: '9:16',
    language: '中文',
  })

  function handleCreate() {
    const project: Project = {
      id: 'proj-' + Date.now(),
      name: form.name || '未命名项目',
      episodes: parseInt(form.episodes) || 3,
      duration: form.duration,
      ratio: form.ratio,
      language: form.language,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'in-progress',
    }
    dispatch({ type: 'CREATE_PROJECT', project })
  }

  const fields = [
    {
      label: '作品名称',
      desc: '你的短剧作品名称',
      node: (
        <Input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="例如：霍去病之封狼居胥"
        />
      ),
    },
    {
      label: '剧集数量',
      desc: '本作品计划共几集',
      node: (
        <Select value={form.episodes} onChange={e => setForm(f => ({ ...f, episodes: e.target.value }))}>
          {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n} 集</option>)}
        </Select>
      ),
    },
    {
      label: '单集时长',
      desc: '每集视频的目标时长',
      node: (
        <Select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
          <option value="30-60s">30–60 秒（极速节奏）</option>
          <option value="60-90s">60–90 秒（标准节奏）</option>
          <option value="90-120s">90–120 秒（沉浸叙事）</option>
        </Select>
      ),
    },
    {
      label: '视频比例',
      desc: '输出视频的画面比例',
      node: (
        <Select value={form.ratio} onChange={e => setForm(f => ({ ...f, ratio: e.target.value }))}>
          <option value="9:16">9:16 竖屏（推荐，移动端）</option>
          <option value="16:9">16:9 横屏（电脑端）</option>
          <option value="1:1">1:1 方形</option>
        </Select>
      ),
    },
    {
      label: '语言',
      desc: '剧本语言与配音语言',
      node: (
        <Select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
          <option value="中文">中文普通话</option>
          <option value="英文">英文</option>
        </Select>
      ),
    },
  ]

  return (
    <PageLayout title="创建项目" description="填写基础信息，开始你的 AI 短剧创作">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-5 md:px-6 md:py-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1F2330] border border-white/[0.06] rounded-2xl overflow-hidden"
            >
              <div className="p-5 md:p-6 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E91E63]/10 border border-[#EC407A]/20 flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-[#F06292]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#EDEEF0]">新建短剧项目</h3>
                    <p className="text-[12px] md:text-xs text-[#B4B7BE] mt-0.5 leading-snug">所有字段均有默认推荐值，可直接点击创建</p>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6 space-y-5 md:space-y-6">
                {fields.map((field, i) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-1.5 md:gap-6">
                      <div className="md:w-24 md:flex-shrink-0 md:pt-2">
                        <Label className="text-[#D2D5DB]">{field.label}</Label>
                        <p className="text-[12px] text-[#5E6068] md:text-[#444488] mt-0.5 leading-snug">{field.desc}</p>
                      </div>
                      <div className="flex-1">{field.node}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Preview */}
              <div className="mx-5 md:mx-6 mb-5 md:mb-6 bg-[#181B24] border border-white/[0.06] rounded-xl p-4">
                <p className="text-[12px] text-[#5E6068] uppercase tracking-widest mb-3 font-medium">项目预览</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['作品名称', form.name || '—'],
                    ['剧集数量', `${form.episodes} 集`],
                    ['单集时长', form.duration],
                    ['视频比例', form.ratio],
                    ['语言', form.language],
                    ['配音语言', form.language === '中文' ? '普通话' : 'English'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[12px] text-[#8B8E96]">{k}</p>
                      <p className="text-xs text-[#EDEEF0] font-medium mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <ActionBar>
          <span className="hidden md:block" />
          <Button size="lg" onClick={handleCreate} disabled={!form.name.trim()} className="w-full md:w-auto">
            创建项目
            <ArrowRight className="w-4 h-4" />
          </Button>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
