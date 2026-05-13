import { cn } from '@/lib/utils'
import { Film, Lock } from 'lucide-react'

interface CharacterAvatarProps {
  name: string
  colorHue: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  imageUrl?: string
  imagePosition?: string
}

export function CharacterAvatar({
  name, colorHue, size = 'md', className, imageUrl, imagePosition = 'center 8%',
}: CharacterAvatarProps) {
  const sizeMap = { sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-24 h-24' }
  const textMap = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden',
        sizeMap[size],
        className
      )}
      style={!imageUrl ? {
        background: `radial-gradient(circle at 30% 30%, hsl(${colorHue}, 65%, 35%), hsl(${colorHue + 40}, 55%, 18%))`,
        boxShadow: `0 0 0 2px hsla(${colorHue}, 60%, 50%, 0.25)`,
      } : undefined}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          style={{ objectPosition: imagePosition }}
        />
      ) : (
        <span className={cn('font-semibold text-white/90 select-none', textMap[size])}>
          {name.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

interface ShotPlaceholderProps {
  shotNum: number
  episodeNum?: number
  status?: 'idle' | 'generating' | 'done' | 'locked' | 'failed'
  className?: string
  aspect?: '9/16' | '16/9'
  imageUrl?: string
}

const SHOT_GRADIENTS = [
  'linear-gradient(160deg, #1a1a3e 0%, #2d1b4e 60%, #1a0e2a 100%)',
  'linear-gradient(160deg, #1a1f0e 0%, #1e3a12 60%, #0a1a06 100%)',
  'linear-gradient(160deg, #2a1510 0%, #3a1e14 60%, #1a0806 100%)',
  'linear-gradient(160deg, #0f1a2a 0%, #142238 60%, #081218 100%)',
  'linear-gradient(160deg, #1a0e2a 0%, #2d1b4e 60%, #1a1a3e 100%)',
]

export function ShotPlaceholder({
  shotNum, episodeNum = 1, status = 'idle', className, aspect = '9/16', imageUrl,
}: ShotPlaceholderProps) {
  const gradient = SHOT_GRADIENTS[(shotNum + episodeNum * 3 - 1) % SHOT_GRADIENTS.length]
  const isLocked = status === 'locked'
  const showImage = imageUrl && (status === 'done' || status === 'locked')

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg flex items-center justify-center',
        aspect === '9/16' ? 'aspect-[9/16]' : 'aspect-video',
        className
      )}
      style={{ background: gradient }}
    >
      {/* Real image when available and generated */}
      {showImage && (
        <img
          src={imageUrl}
          alt={`Shot ${shotNum}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Shimmer for generating */}
      {status === 'generating' && <div className="shimmer absolute inset-0" />}

      {/* Idle placeholder icon */}
      {status === 'idle' && !showImage && (
        <div className="flex flex-col items-center gap-1.5 opacity-25">
          <Film className="w-6 h-6 text-white" />
          <span className="text-[12px] text-white font-mono">
            EP{episodeNum} · S{shotNum}
          </span>
        </div>
      )}

      {/* Lock badge */}
      {isLocked && (
        <div className="absolute top-1.5 right-1.5 bg-amber-500/20 border border-amber-500/30 rounded p-0.5 z-10">
          <Lock className="w-3 h-3 text-amber-400" />
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/70 to-transparent z-10" />
      <div className="absolute bottom-1.5 left-2 text-[13px] text-white/70 font-mono z-10">
        {String(shotNum).padStart(2, '0')}
      </div>
    </div>
  )
}
