import { lazy, Suspense, useEffect, useState } from "react";

import { AudioManager } from "../audio/AudioManager";
import { HUD } from "./ui/HUD";

// three.js must never be evaluated during SSR, so the canvas is loaded lazily
// after hydration.
const GameCanvas = lazy(() => import("./GameCanvas"));

export function GameScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    AudioManager.init();
  }, []);

  return (
    <main className="game-viewport relative overflow-hidden bg-game-bg">
      {mounted ? (
        <Suspense fallback={<LoadingScreen />}>
          <GameCanvas />
        </Suspense>
      ) : (
        <LoadingScreen />
      )}
      {mounted && <HUD />}
    </main>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <p className="animate-pulse text-sm font-bold uppercase tracking-[0.3em] text-hud-foreground/60">
        Warming up
      </p>
    </div>
  );
}
