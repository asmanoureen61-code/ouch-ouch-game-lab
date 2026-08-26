import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group, Mesh } from "three";
import { MathUtils } from "three";

import { GAME_CONFIG } from "../../config/gameConfig";
import { useGameStore } from "../../state/useGameStore";

interface CharacterProps {
  onHit: (clientX: number, clientY: number) => void;
}

/**
 * The victim. Primitive-built for now so there is zero asset dependency;
 * swap the meshes for a GLTF later without touching the reaction logic.
 */
export function Character({ onHit }: CharacterProps) {
  const group = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  const reaction = useRef(0);
  const reactionTick = useGameStore((s) => s.reactionTick);

  useEffect(() => {
    if (reactionTick > 0) reaction.current = 1;
  }, [reactionTick]);

  useFrame((_, delta) => {
    const g = group.current;
    const b = body.current;
    if (!g || !b) return;

    reaction.current = Math.max(
      0,
      reaction.current - delta / GAME_CONFIG.reaction.durationSec,
    );
    const r = reaction.current;
    const t = performance.now() / 1000;

    const bob =
      Math.sin(t * GAME_CONFIG.character.idleBobSpeed) * GAME_CONFIG.character.idleBobAmount;

    g.position.y = MathUtils.lerp(g.position.y, bob + r * 0.12, 0.35);
    g.position.x = MathUtils.lerp(g.position.x, r * GAME_CONFIG.reaction.knockbackAmount * 0.4, 0.3);
    g.rotation.z = MathUtils.lerp(g.rotation.z, -r * 0.28, 0.35);

    const squash = 1 - r * GAME_CONFIG.reaction.squashAmount;
    b.scale.set(1 / squash, squash, 1 / squash);
  });

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(e.nativeEvent.clientX, e.nativeEvent.clientY);
      }}
    >
      {/* body */}
      <mesh ref={body} position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.42, 0.8, 8, 24]} />
        <meshStandardMaterial color="#f2b98c" roughness={0.55} />
      </mesh>

      {/* head */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#f7c9a3" roughness={0.5} />
      </mesh>

      {/* eyes */}
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 2.02, 0.38]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#20161a" />
        </mesh>
      ))}

      {/* arms */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 1.1, 0]} rotation={[0, 0, x > 0 ? -0.25 : 0.25]} castShadow>
          <capsuleGeometry args={[0.13, 0.6, 6, 12]} />
          <meshStandardMaterial color="#f2b98c" roughness={0.6} />
        </mesh>
      ))}

      {/* legs */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]} castShadow>
          <capsuleGeometry args={[0.16, 0.5, 6, 12]} />
          <meshStandardMaterial color="#3f4b8f" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
