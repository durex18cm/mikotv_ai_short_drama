import type { Variants, Transition } from 'framer-motion'

// Premium easing curves
const enterEase = [0.16, 1, 0.3, 1] as const   // smooth decisive entry (ease-out-expo style)
const exitEase = [0.7, 0, 0.84, 0] as const    // quick decisive exit

// Spring presets — natural, settled, no bouncy overshoot
const cardSpring: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 26,
  mass: 0.85,
}

const listSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 0.7,
}

// Page-level transition. Opacity finishes fast (0.2s) so children can safely
// start their own opacity animations after delayChildren >= 0.22s without
// stacking two opacity fades on top of each other (the previous flicker root cause).
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.985,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      opacity: { duration: 0.2, ease: enterEase },
      y: { duration: 0.55, ease: enterEase },
      scale: { duration: 0.55, ease: enterEase },
      filter: { duration: 0.4, ease: enterEase },
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    filter: 'blur(6px)',
    transition: {
      duration: 0.2,
      ease: exitEase,
    },
  },
}

// Container that orchestrates staggered children appearance.
// delayChildren is set just above the page-level opacity duration (0.2s)
// to guarantee no opacity-on-opacity overlap with the page fade.
export const gridContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.24,
      staggerChildren: 0.055,
    },
  },
}

// Grid cards: spring-up with subtle scale. No blur on items to keep
// performance smooth even with 15+ cards on screen at once.
export const gridItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.92,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: cardSpring,
  },
}

// List rows: subtle horizontal slide combined with vertical settle.
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -14,
    y: 6,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: listSpring,
  },
}

// Single decorative panels (sidebar callouts, info banners, etc.).
export const panelRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.97,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: enterEase,
      delay: 0.18,
    },
  },
}
