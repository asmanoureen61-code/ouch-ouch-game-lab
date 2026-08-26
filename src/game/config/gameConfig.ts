/**
 * Central tuning values for OUCH OUCH.
 * Keep every magic number here so systems stay declarative.
 */
export const GAME_CONFIG = {
  scoring: {
    baseHitPoints: 10,
    comboWindowMs: 1400,
    maxComboMultiplier: 8,
  },
  reaction: {
    /** How long a single "ouch" reaction plays, in seconds. */
    durationSec: 0.45,
    squashAmount: 0.28,
    knockbackAmount: 0.35,
  },
  camera: {
    position: [0, 1.7, 6.2] as [number, number, number],
    fov: 42,
    lookAt: [0, 1.1, 0] as [number, number, number],
    shakeDecay: 6,
    shakeAmount: 0.18,
  },
  character: {
    idleBobSpeed: 1.6,
    idleBobAmount: 0.045,
  },
  audio: {
    masterVolume: 0.7,
  },
} as const;

export const REACTION_LINES = [
  "OUCH!",
  "OW!",
  "HEY!",
  "OOF!",
  "YEOWCH!",
  "NOT AGAIN!",
  "STOP IT!",
] as const;
