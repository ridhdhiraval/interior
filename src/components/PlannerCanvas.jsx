import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { plannerState } from "../planner/plannerState";

export default function PlannerCanvas() {
  return (
    <Canvas camera={{ position: [6, 6, 6] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#eaeaea" />
      </mesh>

      {/* Walls */}
      {plannerState.walls.map((w, i) => (
        <mesh key={i}>
          <boxGeometry args={[5, w.height, 0.2]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      ))}

      <OrbitControls />
    </Canvas>
  );
}
