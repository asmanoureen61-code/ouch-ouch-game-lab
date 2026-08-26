export function Stage() {
  return (
    <group>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.4} color="#8fb7ff" />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[7, 48]} />
        <meshStandardMaterial color="#2a2440" roughness={0.9} />
      </mesh>

      {/* backdrop */}
      <mesh position={[0, 4, -5]}>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color="#191530" roughness={1} />
      </mesh>
    </group>
  );
}
