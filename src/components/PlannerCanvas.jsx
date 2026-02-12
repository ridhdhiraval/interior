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
=======
import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text, Edges, MapControls } from "@react-three/drei";
import { usePlanner } from "../planner/PlannerContext";
import * as THREE from 'three';

// --- Blueprint Wall Component ---
const Wall = ({ start, end, height, thickness = 0.2, color = "#cccccc", opacity = 1, isPreview = false }) => {
  // Calculate position, rotation, and length based on start/end points
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx); // Rotation around Y axis
  
  // Midpoint for position
  const cx = (start[0] + end[0]) / 2;
  const cz = (start[2] + end[2]) / 2;
  const cy = height / 2;

  // Measurement Text
  // We place text slightly above the wall (in 2D top view terms: "above" means -Z or +Z in local space)
  // Since we are top-down, we want text to be readable.
  // Rotation: -angle aligns with wall.
  // Position: Offset by thickness/2 + padding
  const textOffset = thickness / 2 + 0.4;
  
  // Calculate text position in world space
  // We need to offset from center perpendicular to wall direction
  const perpX = -Math.sin(angle);
  const perpZ = Math.cos(angle);
  const textX = cx + perpX * textOffset;
  const textZ = cz + perpZ * textOffset;

  return (
    <group>
      {/* Wall Mesh (Grey Fill) */}
      <mesh position={[cx, cy, cz]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[length, height, thickness]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
        {/* Dark Outline */}
        <Edges color="#555555" threshold={15} />
      </mesh>

      {/* Start Node */}
      <mesh position={[start[0], height/2, start[2]]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[thickness * 0.8, 16]} />
        <meshBasicMaterial color="#999" />
        <Edges color="#555" />
      </mesh>
      
      {/* End Node */}
      <mesh position={[end[0], height/2, end[2]]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[thickness * 0.8, 16]} />
        <meshBasicMaterial color="#999" />
        <Edges color="#555" />
      </mesh>

      {/* Dimension Label */}
      {!isPreview && (
        <Text
          position={[textX, height + 0.5, textZ]} // Lifted up to be above everything
          rotation={[-Math.PI / 2, 0, -angle]} // Rotate to lay flat and align with wall
          fontSize={0.4}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {(length * 100).toFixed(1)}
        </Text>
      )}
    </group>
  );
};

// --- Furniture Component ---
const Furniture = ({ item, x, z, rotation = 0, isPreview = false }) => {
  const widthM = item.width / 100;
  const depthM = item.depth / 100;
  
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      {/* Furniture Body */}
      <mesh position={[0, 0.5, 0]}> {/* Lift slightly above floor */}
        <boxGeometry args={[widthM, 0.1, depthM]} />
        <meshBasicMaterial color={item.color || "#888"} transparent opacity={isPreview ? 0.6 : 1} />
        <Edges color="#333" />
      </mesh>
      
      {/* Direction Indicator (Triangle) */}
      <mesh position={[0, 0.51, -depthM/2 + 0.1]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.1, 3]} />
        <meshBasicMaterial color="#333" />
      </mesh>
    </group>
  );
};

const InteractionPlane = () => {
  const { state, actions } = usePlanner();
  const [startPoint, setStartPoint] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null);

  const handlePlaneClick = (e) => {
    if (e.button !== 0) return;
    
    // Get intersection point on the plane
    const point = [e.point.x, 0, e.point.z];

    // --- Furniture Placement ---
    if (state.placingFurniture) {
      e.stopPropagation();
      actions.addFurniture({
        itemId: state.placingFurniture.id,
        item: state.placingFurniture,
        x: point[0],
        z: point[2],
        rotation: 0,
      });
      return;
    }

    // --- Wall Drawing ---
    if (state.activeTool === 'WALL') {
      e.stopPropagation();

      if (!startPoint) {
        // First click: Start wall
        setStartPoint(point);
      } else {
        // Second click: Finish wall
        actions.addWall({ start: startPoint, end: point });
        // Chain: Start next wall from this end point
        setStartPoint(point); 
      }
    }
  };

  const handlePointerMove = (e) => {
    const point = [e.point.x, 0, e.point.z];
    setHoverPoint(point);

    if (state.activeTool === 'WALL' && startPoint) {
      actions.updatePreview({ start: startPoint, end: point, height: state.wallHeight });
    }
  };

  const handleContextMenu = (e) => {
    e.stopPropagation();
    
    if (state.placingFurniture) {
      actions.cancelPlacingFurniture();
      return;
    }

    if (state.activeTool === 'WALL') {
      setStartPoint(null);
      actions.clearPreview();
    }
  };

  return (
    <group>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        onClick={handlePlaneClick}
        onPointerMove={handlePointerMove}
        onContextMenu={handleContextMenu}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial visible={false} /> 
      </mesh>

      {/* Ghost Furniture Preview */}
      {state.placingFurniture && hoverPoint && (
        <Furniture 
          item={state.placingFurniture} 
          x={hoverPoint[0]} 
          z={hoverPoint[2]} 
          isPreview={true} 
        />
      )}
    </group>
  );
};

export default function PlannerCanvas() {
  const { state } = usePlanner();

  return (
    <Canvas 
      orthographic 
      camera={{ position: [0, 50, 0], zoom: 40, up: [0, 0, -1], near: 0.1, far: 1000 }}
      shadows={false} // Disable shadows for clean 2D look
    >
      {/* White Background */}
      <color attach="background" args={['#ffffff']} />
      
      {/* Even Lighting */}
      <ambientLight intensity={1.5} />
      
      {/* Interaction Plane & Controls */}
      <InteractionPlane />

      {/* Render Existing Walls */}
      {state.walls.map((w, i) => (
        <Wall key={i} start={w.start} end={w.end} height={w.height / 100} />
      ))}

      {/* Render Preview Wall */}
      {state.previewWall && (
        <Wall 
          start={state.previewWall.start} 
          end={state.previewWall.end} 
          height={state.previewWall.height / 100} 
          color="#999" 
          opacity={0.6}
          isPreview={true}
        />
      )}

      {/* Render Furniture */}
      {state.furniture.map((f) => (
        <Furniture 
          key={f.id} 
          item={f.item || f} // Handle legacy or structure change
          x={f.x} 
          z={f.z} 
          rotation={f.rotation} 
        />
      ))}

      {/* 2D Pan/Zoom Controls */}
      <MapControls 
        enableRotate={false} 
        screenSpacePanning={true}
        minZoom={10}
        maxZoom={100}
      />
>>>>>>> bbfc30066be1832d95eae055ffff91da37ce73ce
    </Canvas>
  );
}
