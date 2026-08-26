import { create } from "zustand";

import { GAME_CONFIG, REACTION_LINES } from "../config/gameConfig";

export type GamePhase = "ready" | "playing";

export interface HitEvent {
  id: number;
  /** Normalized screen position where the hit landed (0..1). */
  x: number;
  y: number;
  line: string;
  points: number;
  combo: number;
}

interface GameState {
  phase: GamePhase;
  score: number;
  combo: number;
  bestCombo: number;
  hits: number;
  lastHitAt: number;
  /** Incremented on every hit so the 3D character can trigger a reaction. */
  reactionTick: number;
  events: HitEvent[];

  start: () => void;
  registerHit: (x: number, y: number) => void;
  clearEvent: (id: number) => void;
  reset: () => void;
}

let eventId = 0;

const comboMultiplier = (combo: number) =>
  Math.min(1 + Math.floor(combo / 3), GAME_CONFIG.scoring.maxComboMultiplier);

export const useGameStore = create<GameState>((set, get) => ({
  phase: "ready",
  score: 0,
  combo: 0,
  bestCombo: 0,
  hits: 0,
  lastHitAt: 0,
  reactionTick: 0,
  events: [],

  start: () => set({ phase: "playing" }),

  registerHit: (x, y) => {
    const now = performance.now();
    const state = get();
    const inWindow = now - state.lastHitAt < GAME_CONFIG.scoring.comboWindowMs;
    const combo = inWindow ? state.combo + 1 : 1;
    const points = GAME_CONFIG.scoring.baseHitPoints * comboMultiplier(combo);
    const line = REACTION_LINES[Math.floor(Math.random() * REACTION_LINES.length)]!;

    eventId += 1;

    set({
      phase: "playing",
      score: state.score + points,
      combo,
      bestCombo: Math.max(state.bestCombo, combo),
      hits: state.hits + 1,
      lastHitAt: now,
      reactionTick: state.reactionTick + 1,
      events: [...state.events, { id: eventId, x, y, line, points, combo }].slice(-8),
    });
  },

  clearEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

  reset: () =>
    set({
      phase: "ready",
      score: 0,
      combo: 0,
      bestCombo: 0,
      hits: 0,
      lastHitAt: 0,
      events: [],
    }),
}));
