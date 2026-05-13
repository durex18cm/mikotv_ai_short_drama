export type StepStatus = 'pending' | 'active' | 'completed'
export type GenStatus = 'idle' | 'queued' | 'generating' | 'done' | 'failed' | 'locked'
export type SynthesisStatus = 'idle' | 'generating' | 'done' | 'failed'

export interface Project {
  id: string
  name: string
  episodes: number
  duration: string
  ratio: string
  language: string
  createdAt: string
  status: 'draft' | 'in-progress' | 'completed' | 'exported'
}

export interface Character {
  id: string
  name: string
  age: string
  role: string
  appearance: string
  costume: string
  personality: string
  voiceType: string
  voiceDesc: string
  voiceGender: 'male' | 'female'
  voiceAge: 'young' | 'mature'
  colorHue: number
  confirmed: boolean
}

export interface Scene {
  id: string
  episodeId: string
  num: number
  title: string
  location: string
  time: string
}

export interface Shot {
  id: string
  episodeId: string
  sceneId: string
  num: number
  type: string
  description: string
  characters: string[]
  action: string
  dialogue?: string
  narrator?: string
  sfx?: string
  music?: string
  duration: number
  keyframeStatus: GenStatus
  videoStatus: GenStatus
}

export interface Episode {
  id: string
  num: number
  title: string
  sceneCount: number
  shotCount: number
  totalDuration: number
  synthesisStatus: SynthesisStatus
}

export interface VisualStyle {
  id: string
  name: string
  description: string
  tags: string[]
  gradient: string
  accentColor: string
}

export interface SubtitleLine {
  id: string
  shotId: string
  episodeId: string
  character: string
  text: string
  startTime: number
  endTime: number
}
