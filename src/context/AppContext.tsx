import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Character, Episode, GenStatus, Project, Shot, StepStatus, SynthesisStatus } from '@/types'
import {
  MOCK_CHARACTERS,
  MOCK_EPISODES,
  MOCK_SHOTS,
  MOCK_SCRIPT,
} from '@/data/mockData'

interface EpisodeState extends Episode {
  synthesisStatus: SynthesisStatus
}

interface AppState {
  currentStep: number
  project: Project | null
  scriptContent: string
  scriptParsed: boolean
  characters: Character[]
  selectedStyle: string | null
  storyboardGenerated: boolean
  keyframesGenerated: boolean
  videoGenerated: boolean
  voiceGenerated: boolean
  synthesisCompleted: boolean
  exportCompleted: boolean
  stepStatuses: StepStatus[]
  shots: Shot[]
  episodes: EpisodeState[]
  subtitleEnabled: boolean
  selectedEpisodeId: string
}

type AppAction =
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'NEW_PROJECT' }
  | { type: 'CREATE_PROJECT'; project: Project }
  | { type: 'SET_SCRIPT'; content: string }
  | { type: 'PARSE_SCRIPT' }
  | { type: 'CONFIRM_SCRIPT' }
  | { type: 'UPDATE_CHARACTER'; character: Character }
  | { type: 'CONFIRM_CHARACTERS' }
  | { type: 'SELECT_STYLE'; styleId: string }
  | { type: 'CONFIRM_STYLE' }
  | { type: 'GENERATE_STORYBOARD' }
  | { type: 'GENERATE_KEYFRAMES' }
  | { type: 'UPDATE_SHOT_KEYFRAME'; shotId: string; status: GenStatus }
  | { type: 'GENERATE_VIDEOS' }
  | { type: 'UPDATE_SHOT_VIDEO'; shotId: string; status: GenStatus }
  | { type: 'GENERATE_VOICE' }
  | { type: 'GENERATE_SYNTHESIS'; episodeId: string; status: SynthesisStatus }
  | { type: 'GENERATE_ALL_SYNTHESIS' }
  | { type: 'COMPLETE_EXPORT' }
  | { type: 'TOGGLE_SUBTITLE' }
  | { type: 'SELECT_EPISODE'; episodeId: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }

const TOTAL_STEPS = 12

function makeStatuses(): StepStatus[] {
  return Array.from({ length: TOTAL_STEPS + 1 }, (_, i) =>
    i === 0 ? 'completed' : 'pending'
  )
}

function advanceStatus(statuses: StepStatus[], current: number): StepStatus[] {
  const s = [...statuses]
  if (current >= 1 && current <= TOTAL_STEPS) s[current] = 'completed'
  const next = current + 1
  if (next >= 1 && next <= TOTAL_STEPS) s[next] = 'active'
  return s
}

const initialState: AppState = {
  currentStep: 0,
  project: null,
  scriptContent: '',
  scriptParsed: false,
  characters: MOCK_CHARACTERS,
  selectedStyle: null,
  storyboardGenerated: false,
  keyframesGenerated: false,
  videoGenerated: false,
  voiceGenerated: false,
  synthesisCompleted: false,
  exportCompleted: false,
  stepStatuses: makeStatuses(),
  shots: MOCK_SHOTS,
  episodes: MOCK_EPISODES.map(ep => ({ ...ep })),
  subtitleEnabled: true,
  selectedEpisodeId: 'ep1',
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.step }

    case 'NEW_PROJECT': {
      const statuses = makeStatuses()
      statuses[1] = 'active'
      return { ...initialState, currentStep: 1, stepStatuses: statuses }
    }

    case 'CREATE_PROJECT': {
      const statuses = advanceStatus(state.stepStatuses, 1)
      return { ...state, project: action.project, currentStep: 2, stepStatuses: statuses }
    }

    case 'SET_SCRIPT':
      return { ...state, scriptContent: action.content }

    case 'PARSE_SCRIPT':
      return { ...state, scriptParsed: true }

    case 'CONFIRM_SCRIPT': {
      const statuses = advanceStatus(state.stepStatuses, 2)
      // also complete step 3 since analysis comes right after
      statuses[3] = 'completed'
      statuses[4] = 'active'
      return { ...state, currentStep: 4, stepStatuses: statuses }
    }

    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(c =>
          c.id === action.character.id ? action.character : c
        ),
      }

    case 'CONFIRM_CHARACTERS': {
      const statuses = advanceStatus(state.stepStatuses, 4)
      return {
        ...state,
        characters: state.characters.map(c => ({ ...c, confirmed: true })),
        currentStep: 5,
        stepStatuses: statuses,
      }
    }

    case 'SELECT_STYLE':
      return { ...state, selectedStyle: action.styleId }

    case 'CONFIRM_STYLE': {
      const statuses = advanceStatus(state.stepStatuses, 5)
      return { ...state, currentStep: 6, stepStatuses: statuses }
    }

    case 'GENERATE_STORYBOARD': {
      const statuses = advanceStatus(state.stepStatuses, 6)
      return { ...state, storyboardGenerated: true, currentStep: 7, stepStatuses: statuses }
    }

    case 'GENERATE_KEYFRAMES': {
      const statuses = advanceStatus(state.stepStatuses, 7)
      const shots = state.shots.map(s => ({ ...s, keyframeStatus: 'done' as GenStatus }))
      return { ...state, keyframesGenerated: true, shots, currentStep: 8, stepStatuses: statuses }
    }

    case 'UPDATE_SHOT_KEYFRAME':
      return {
        ...state,
        shots: state.shots.map(s =>
          s.id === action.shotId ? { ...s, keyframeStatus: action.status } : s
        ),
      }

    case 'GENERATE_VIDEOS': {
      const statuses = advanceStatus(state.stepStatuses, 8)
      const shots = state.shots.map(s => ({ ...s, videoStatus: 'done' as GenStatus }))
      return { ...state, videoGenerated: true, shots, currentStep: 9, stepStatuses: statuses }
    }

    case 'UPDATE_SHOT_VIDEO':
      return {
        ...state,
        shots: state.shots.map(s =>
          s.id === action.shotId ? { ...s, videoStatus: action.status } : s
        ),
      }

    case 'GENERATE_VOICE': {
      const statuses = advanceStatus(state.stepStatuses, 9)
      return { ...state, voiceGenerated: true, currentStep: 10, stepStatuses: statuses }
    }

    case 'GENERATE_SYNTHESIS': {
      return {
        ...state,
        episodes: state.episodes.map(ep =>
          ep.id === action.episodeId ? { ...ep, synthesisStatus: action.status } : ep
        ),
      }
    }

    case 'GENERATE_ALL_SYNTHESIS': {
      const statuses = advanceStatus(state.stepStatuses, 10)
      const episodes = state.episodes.map(ep => ({ ...ep, synthesisStatus: 'done' as SynthesisStatus }))
      return { ...state, synthesisCompleted: true, episodes, currentStep: 11, stepStatuses: statuses }
    }

    case 'COMPLETE_EXPORT': {
      const statuses = advanceStatus(state.stepStatuses, 12)
      return { ...state, exportCompleted: true, stepStatuses: statuses }
    }

    case 'TOGGLE_SUBTITLE':
      return { ...state, subtitleEnabled: !state.subtitleEnabled }

    case 'SELECT_EPISODE':
      return { ...state, selectedEpisodeId: action.episodeId }

    case 'NEXT_STEP': {
      const next = Math.min(state.currentStep + 1, TOTAL_STEPS)
      const statuses = [...state.stepStatuses]
      if (state.currentStep >= 1) statuses[state.currentStep] = 'completed'
      if (next >= 1 && next <= TOTAL_STEPS) statuses[next] = 'active'
      return { ...state, currentStep: next, stepStatuses: statuses }
    }

    case 'PREV_STEP': {
      const prev = Math.max(state.currentStep - 1, 1)
      return { ...state, currentStep: prev }
    }

    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    scriptContent: MOCK_SCRIPT,
  })
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Derived helpers
export function useCurrentShots(episodeId: string) {
  const { state } = useApp()
  return state.shots.filter(s => s.episodeId === episodeId)
}
