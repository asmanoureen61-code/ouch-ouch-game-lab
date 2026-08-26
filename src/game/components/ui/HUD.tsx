import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AudioManager } from "../../audio/AudioManager";
import { useGameStore } from "../../state/useGameStore";

function FloatingReactions() {
  const events = useGameStore((s) => s.events);
  const clearEvent = useGameStore((s) => s.clearEvent);

  useEffect(() => {
    if (events.length === 0) return;
    const timers = events.map((e) => setTimeout(() => clearEvent(e.id), 900));
    return () => timers.forEach(clearTimeout);
  }, [events, clearEvent]);

  return (
    <AnimatePresence>
      {events.map((e) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: 1, y: -70, scale: 1 }}
          exit={{ opacity: 0, y: -110, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ left: `${e.x * 100}%`, top: `${e.y * 100}%` }}
        >
          <span className="block text-3xl font-black tracking-tight text-hud-accent drop-shadow-lg sm:text-4xl">
            {e.line}
          </span>
          <span className="block text-sm font-bold text-hud-foreground/80">+{e.points}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export function HUD() {
  const score = useGameStore((s) => s.score);
  const combo = useGameStore((s) => s.combo);
  const bestCombo = useGameStore((s) => s.bestCombo);
  const hits = useGameStore((s) => s.hits);
  const [muted, setMuted] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      <FloatingReactions />

      <header className="safe-top absolute inset-x-0 top-0 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-hud-foreground/60">
            Ouch Ouch
          </p>
          <p className="text-4xl font-black leading-none text-hud-foreground tabular-nums sm:text-5xl">
            {score}
          </p>
          <p className="mt-1 truncate text-xs font-medium text-hud-foreground/60">
            {hits} hits · best combo x{bestCombo}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {combo > 1 && (
            <motion.span
              key={combo}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-hud-accent/20 px-3 py-1 text-sm font-black text-hud-accent"
            >
              COMBO x{combo}
            </motion.span>
          )}
          <button
            type="button"
            onClick={() => {
              const next = !muted;
              setMuted(next);
              AudioManager.setMuted(next);
            }}
            className="pointer-events-auto rounded-full bg-hud-panel px-3 py-2 text-xs font-bold text-hud-foreground/80 backdrop-blur transition-colors hover:text-hud-foreground"
          >
            {muted ? "SOUND OFF" : "SOUND ON"}
          </button>
        </div>
      </header>

      <footer className="safe-bottom absolute inset-x-0 bottom-0 flex justify-center p-4">
        <p className="rounded-full bg-hud-panel px-4 py-2 text-center text-xs font-medium text-hud-foreground/70 backdrop-blur">
          Tap the guy to make him go ouch
        </p>
      </footer>
    </div>
  );
}
