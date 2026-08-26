import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { GAME_CONFIG } from "../config/gameConfig";
import { useGameStore } from "../state/useGameStore";

/** Frames the character and adds impact shake on every hit. */
export function CameraController() {
  const camera = useThree((s) => s.camera);
  const shake = useRef(0);
  const reactionTick = useGameStore((s) => s.reactionTick);

  useEffect(() => {
    camera.position.set(...GAME_CONFIG.camera.position);
    camera.lookAt(...GAME_CONFIG.camera.lookAt);
  }, [camera]);

  useEffect(() => {
    if (reactionTick > 0) shake.current = 1;
  }, [reactionTick]);

  useFrame((_, delta) => {
    shake.current = Math.max(0, shake.current - delta * GAME_CONFIG.camera.shakeDecay);
    const s = shake.current * GAME_CONFIG.camera.shakeAmount;
    const [x, y, z] = GAME_CONFIG.camera.position;
    camera.position.set(
      x + (Math.random() - 0.5) * s,
      y + (Math.random() - 0.5) * s,
      z + (Math.random() - 0.5) * s * 0.4,
    );
    camera.lookAt(...GAME_CONFIG.camera.lookAt);
  });

  return null;
}
