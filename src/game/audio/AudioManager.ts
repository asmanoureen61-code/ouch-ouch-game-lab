import { Howler } from "howler";

import { GAME_CONFIG } from "../config/gameConfig";

/**
 * Thin wrapper around Howler. No sample files ship yet, so hit feedback is
 * synthesized with the WebAudio context Howler already owns. Once real assets
 * exist, add Howl instances here and keep this public surface unchanged.
 */
class AudioManagerImpl {
  private initialized = false;
  private muted = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;
    Howler.volume(GAME_CONFIG.audio.masterVolume);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    Howler.mute(muted);
  }

  isMuted() {
    return this.muted;
  }

  /** Short synthesized "ouch" blip; pitch rises with the combo. */
  playHit(combo = 1) {
    this.init();
    if (this.muted) return;

    const ctx = Howler.ctx as AudioContext | null;
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    const base = 220 + Math.min(combo, 12) * 18;
    osc.frequency.setValueAtTime(base * 1.8, now);
    osc.frequency.exponentialRampToValueAtTime(base, now + 0.18);

    const peak = 0.28 * GAME_CONFIG.audio.masterVolume;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(Howler.masterGain ?? ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }
}

export const AudioManager = new AudioManagerImpl();
