import { AppProvider, useApp } from '@/context/AppContext'
import { AppShell } from '@/components/layout/AppShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Dashboard } from '@/pages/Dashboard'
import { CreateProject } from '@/pages/CreateProject'
import { UploadScript } from '@/pages/UploadScript'
import { ScriptAnalysis } from '@/pages/ScriptAnalysis'
import { Characters } from '@/pages/Characters'
import { VisualStyle } from '@/pages/VisualStyle'
import { Storyboard } from '@/pages/Storyboard'
import { Keyframes } from '@/pages/Keyframes'
import { VideoGeneration } from '@/pages/VideoGeneration'
import { VoiceSubtitle } from '@/pages/VoiceSubtitle'
import { AutoEdit } from '@/pages/AutoEdit'
import { Preview } from '@/pages/Preview'
import { Export } from '@/pages/Export'

const STEP_PAGES: Record<number, React.ComponentType> = {
  1: CreateProject,
  2: UploadScript,
  3: ScriptAnalysis,
  4: Characters,
  5: VisualStyle,
  6: Storyboard,
  7: Keyframes,
  8: VideoGeneration,
  9: VoiceSubtitle,
  10: AutoEdit,
  11: Preview,
  12: Export,
}

function AppContent() {
  const { state } = useApp()
  const { currentStep } = state

  if (currentStep === 0) {
    return <Dashboard />
  }

  const PageComponent = STEP_PAGES[currentStep]
  if (!PageComponent) return null

  return (
    <AppShell>
      <PageComponent />
    </AppShell>
  )
}

export default function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </TooltipProvider>
  )
}
