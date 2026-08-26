import { Canvas } from "@react-three/fiber";

import { AudioManager } from "../audio/AudioManager";
import { useGameStore } from "../state/useGameStore";
import { CameraController } from "./CameraController";
import { Character } from "./character/Character";
import { Stage } from "./environment/Stage";

export default function GameCanvas() {
  const registerHit = useGameStore((s) => s.registerHit);

  const handleHit = (clientX: number, clientY: number) => {
    const combo = useGameStore.getState().combo + 1;
    AudioManager.playHit(combo);
    registerHit(clientX / window.innerWidth, clientY / window.innerHeight);
  };

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 42, position: [0, 1.7, 6.2] }}
      gl={{ antialias: true }}
      className="absolute inset-0 touch-none"
    >
      <color attach="background" args={["#12102a"]} />
      <fog attach="fog" args={["#12102a", 9, 20]} />
      <CameraController />
      <Stage />
      <Character onHit={handleHit} />
    </Canvas>
  );
}
