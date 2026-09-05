/**
 * YatraVerse Cultural Guide Animation Configurations
 */

export type GuideAnimationState = 'enter' | 'idle' | 'gesture' | 'hover' | 'interact' | 'exit';

export interface GuideAnimationConfig {
  enterClass: string;
  idleClass: string;
  auraClass: string;
  handClass: string;
  speechBubbleClass: string;
  durationMs: number;
}

export const GUIDE_ANIMATIONS: Record<'popRight' | 'popBottom' | 'popLeft', GuideAnimationConfig> = {
  popRight: {
    enterClass: 'animate-guide-pop-right',
    idleClass: 'animate-guide-idle',
    auraClass: 'animate-guide-aura-rotate',
    handClass: 'animate-guide-hand',
    speechBubbleClass: 'animate-speech-bubble-pop',
    durationMs: 650,
  },
  popBottom: {
    enterClass: 'animate-guide-pop-bottom',
    idleClass: 'animate-guide-idle',
    auraClass: 'animate-guide-aura-rotate',
    handClass: 'animate-guide-hand',
    speechBubbleClass: 'animate-speech-bubble-pop',
    durationMs: 650,
  },
  popLeft: {
    enterClass: 'animate-guide-pop-left',
    idleClass: 'animate-guide-idle',
    auraClass: 'animate-guide-aura-rotate',
    handClass: 'animate-guide-hand',
    speechBubbleClass: 'animate-speech-bubble-pop',
    durationMs: 650,
  },
};

/**
 * Speech bubble lifecycle states:
 * - 'entering': Initial spring pop-in
 * - 'idle': Synchronized with character's idle breathing animation (gentle fade in and out)
 * - 'paused': Stationary at 100% opacity when hovered or user is interacting
 * - 'exiting': Smooth scale and fade out
 * - 'minimized': Compact non-blocking pill format
 */
export type SpeechBubbleLifecycleState =
  | 'hidden'
  | 'entering'
  | 'idle'
  | 'paused'
  | 'exiting'
  | 'minimized';

export interface SpeechBubbleLifecycleConfig {
  enterClass: string;
  idleFadeClass: string;
  exitClass: string;
  enterDurationMs: number;
  idleCycleMs: number;
  exitDurationMs: number;
}

export const SPEECH_BUBBLE_LIFECYCLE_CONFIG: SpeechBubbleLifecycleConfig = {
  enterClass: 'animate-speech-bubble-pop',
  idleFadeClass: 'animate-bubble-idle-fade',
  exitClass: 'animate-speech-bubble-exit',
  enterDurationMs: 380,
  idleCycleMs: 4500, // Synchronized with character's guideIdleBreath 4.5s
  exitDurationMs: 250,
};

/**
 * Derives the active Tailwind CSS animation class for the speech bubble
 * depending on character idle state, hover status, and current lifecycle.
 */
export function getSpeechBubbleAnimationClass(
  lifecycle: SpeechBubbleLifecycleState,
  isHovered: boolean = false,
  enableIdleFade: boolean = true
): string {
  if (isHovered || lifecycle === 'paused') {
    return 'opacity-100 transform-none transition-opacity duration-200';
  }
  switch (lifecycle) {
    case 'entering':
      return SPEECH_BUBBLE_LIFECYCLE_CONFIG.enterClass;
    case 'idle':
      return enableIdleFade
        ? SPEECH_BUBBLE_LIFECYCLE_CONFIG.idleFadeClass
        : 'opacity-100 transition-opacity duration-300';
    case 'exiting':
      return SPEECH_BUBBLE_LIFECYCLE_CONFIG.exitClass;
    case 'minimized':
      return 'transition-all duration-200';
    case 'hidden':
      return 'opacity-0 pointer-events-none';
    default:
      return '';
  }
}
