import { motion } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageLayout, ActionBar } from '@/components/layout/AppShell'
import { useApp } from '@/context/AppContext'
import { MOCK_VISUAL_STYLES } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { gridContainerVariants, gridItemVariants, panelRevealVariants } from '@/lib/animations'

export function VisualStyle() {
  const { state, dispatch } = useApp()
  const { selectedStyle } = state

  const selected = MOCK_VISUAL_STYLES.find(s => s.id === selectedStyle)

  function confirmStyle() {
    if (!selectedStyle) return
    dispatch({ type: 'CONFIRM_STYLE' })
  }

  return (
    <PageLayout
      title="选择视觉风格"
      description="选择的风格将统一应用于全片所有剧集、场景和镜头"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-5 py-4">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 mb-5"
              variants={gridContainerVariants}
              initial="hidden"
              animate="show"
            >
              {MOCK_VISUAL_STYLES.map(style => {
                const isSelected = selectedStyle === style.id
                return (
                  <motion.button
                    key={style.id}
                    variants={gridItemVariants}
                    onClick={() => dispatch({ type: 'SELECT_STYLE', styleId: style.id })}
                    className={cn(
                      'relative text-left rounded-2xl border overflow-hidden transition-colors duration-200 group',
                      isSelected
                        ? 'border-[#EC407A]/60 shadow-md shadow-[#880E4F]/20'
                        : 'border-white/[0.06] hover:border-white/[0.12]'
                    )}
                  >
                    {/* Preview */}
                    <div
                      className="relative aspect-[16/9] flex items-end p-3 overflow-hidden"
                      style={{ background: style.gradient }}
                    >
                      <img
                        src={style.imageUrl}
                        alt={`${style.name}预览`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />
                      {/* Scan lines effect */}
                      <div
                        className="absolute inset-0 opacity-10 mix-blend-screen"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                        }}
                      />
                      <div className="absolute top-3 right-3 z-10">
                        {isSelected && (
                          <div
                            className="w-6 h-6 rounded-full bg-[#E91E63] flex items-center justify-center shadow-lg"
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="relative z-10 flex flex-wrap gap-1">
                        {style.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[13px] px-1.5 py-0.5 rounded bg-black/30 text-white/70 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className={cn(
                      'p-4 transition-colors',
                      isSelected ? 'bg-[#E91E63]/[0.06]' : 'bg-[#12151C]'
                    )}>
                      <h3 className={cn(
                        'text-sm font-semibold mb-1 transition-colors',
                        isSelected ? 'text-[#F48FB1]' : 'text-[#EDEEF0]'
                      )}>
                        {style.name}
                      </h3>
                      <p className="text-[13px] text-[#B4B7BE] leading-snug">{style.description}</p>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>

            {/* Selected style summary */}
            {selected && (
              <motion.div
                key={selected.id}
                variants={panelRevealVariants}
                initial="hidden"
                animate="show"
                className="bg-[#12151C] border border-[#EC407A]/20 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-[#F06292]" />
                  <p className="text-xs font-medium text-[#EDEEF0]">已选风格 · 全片统一配置</p>
                  <Badge variant="violet">已选择</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {[
                    { label: '视觉风格', value: selected.name },
                    { label: '画面比例', value: '9:16 竖屏' },
                    { label: '适合题材', value: selected.tags.join('、') },
                    { label: '镜头语言', value: '电影分镜' },
                    { label: '时代质感', value: '西汉历史战争' },
                    { label: '字幕方案', value: '默认开启' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[12px] text-[#8B8E96]">{item.label}</p>
                      <p className="text-xs text-[#EDEEF0] font-medium mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
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
          <Button onClick={confirmStyle} disabled={!selectedStyle} className="flex-1 md:flex-initial">
            确认风格，生成分镜
            <ArrowRight className="w-4 h-4" />
          </Button>
        </ActionBar>
      </div>
    </PageLayout>
  )
}
