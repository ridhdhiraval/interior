import React, { useState, useMemo } from 'react';
import { Canvas } from "@react-three/fiber";
import { Text, Edges, MapControls } from "@react-three/drei";
import { usePlanner } from "../planner/PlannerContext";
import * as THREE from 'three';

// --- Blueprint Wall Component ---
const Wall = ({ id, start, end, height, thickness = 0.2, color = "#cccccc", opacity = 1, isPreview = false, isSelected = false }) => {
  const { state, actions } = usePlanner();

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
  const textOffset = thickness / 2 + 0.4;
  const perpX = -Math.sin(angle);
  const perpZ = Math.cos(angle);
  const textX = cx + perpX * textOffset;
  const textZ = cz + perpZ * textOffset;

  return (
    <group>
      {/* Wall Mesh (Grey Fill) */}
      <mesh 
        position={[cx, cy, cz]} 
        rotation={[0, -angle, 0]}
        onClick={(e) => {
          if (state.activeTool === 'CHANGE_HEIGHT' && !isPreview) {
            e.stopPropagation();
            actions.selectWall(id);
          }
        }}
      >
        <boxGeometry args={[length, height, thickness]} />
        <meshBasicMaterial color={isSelected ? "#e6f2d5" : color} transparent opacity={opacity} />
        {/* Outline */}
        <Edges color={isSelected ? "#8cc63f" : "#555555"} threshold={15} />
      </mesh>

      {/* Nodes */}
      {!isPreview && (
        <>
          <mesh position={[start[0], height/2, start[2]]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[thickness * 0.8, 16]} />
            <meshBasicMaterial color="#999" />
            <Edges color="#555" />
          </mesh>
          <mesh position={[end[0], height/2, end[2]]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[thickness * 0.8, 16]} />
            <meshBasicMaterial color="#999" />
            <Edges color="#555" />
          </mesh>
        </>
      )}

      {/* Dimension Label */}
      {!isPreview && (
        <Text
          position={[textX, height + 0.5, textZ]} // Lifted up
          rotation={[-Math.PI / 2, 0, -angle]} // Rotate to lay flat
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

// --- Floor Component ---
const Floor = ({ points, color = "#e0e0e0", isPreview = false }) => {
  const shape = useMemo(() => {
    if (points.length < 3) return null;
    const s = new THREE.Shape();
    s.moveTo(points[0][0], -points[0][2]);
    for (let i = 1; i < points.length; i++) {
        s.lineTo(points[i][0], -points[i][2]);
    }
    s.closePath();
    return s;
  }, [points]);

  if (!shape) return null;

  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={isPreview ? 0.4 : 1} />
      <Edges color="#aaa" />
    </mesh>
  );
};

// --- Furniture Component ---
const Furniture = ({ instance, isPreview = false }) => {
  const { item, x, z, rotation = 0, id } = instance;
  const { state, actions } = usePlanner();
  
  const [texture, setTexture] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  
  React.useEffect(() => {
    if (item.image) {
      // Fix relative path for correct resolution on secondary routes
      const url = item.image.startsWith('./') ? item.image.substring(1) : item.image;
      new THREE.TextureLoader().load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      }, undefined, (err) => {
        console.error('Error loading texture:', err);
      });
    }
  }, [item.image]);

  let widthM = (item.width || 100) / 100;
  let depthM = (item.depth || 100) / 100;
  
  if (texture && (!item.width || !item.depth)) {
    const aspect = texture.image.width / texture.image.height;
    if (aspect > 1) {
      widthM = aspect * 1.2;
      depthM = 1.2;
    } else {
      depthM = 1.2;
      widthM = aspect * 1.2;
    }
  }

  const handlePointerDown = (e) => {
    if (isPreview || state.activeTool || state.placingFurniture) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.point.x - x, z: e.point.z - z });
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStart) return;
    e.stopPropagation();
    const newX = e.point.x - dragStart.x;
    const newZ = e.point.z - dragStart.z;
    actions.updateFurniture(id, { x: newX, z: newZ });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    setDragStart(null);
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleContextMenu = (e) => {
    if (isPreview || state.activeTool || state.placingFurniture) return;
    e.stopPropagation();
    actions.updateFurniture(id, { rotation: rotation + Math.PI / 8 }); // Rotate 22.5 deg per right-click
  };

  return (
    <group 
      position={[x, 0, z]} 
      rotation={[0, rotation, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={handleContextMenu}
      onClick={(e) => {
        if (!isPreview && !state.placingFurniture && !state.activeTool) {
           e.stopPropagation();
        }
      }}
    >
      {/* Furniture Body */}
      {texture ? (
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[widthM, depthM]} />
          <meshBasicMaterial 
            map={texture} 
            transparent={true} 
            opacity={isPreview ? 0.6 : 1} 
            side={THREE.DoubleSide} 
            depthWrite={false} 
          />
        </mesh>
      ) : (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[widthM, 0.1, depthM]} />
          <meshBasicMaterial color={item.color || "#ccc"} transparent opacity={isPreview ? 0.6 : 1} />
          <Edges color="#333" />
        </mesh>
      )}
      
      {/* Direction Indicator */}
      <mesh position={[0, 0.51, -depthM/2 + 0.1]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.05, 3]} />
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

    // --- Single Wall Drawing ---
    if (state.activeTool === 'WALL') {
      e.stopPropagation();
      if (!startPoint) {
        setStartPoint(point);
      } else {
        actions.addWall({ start: startPoint, end: point });
        setStartPoint(null); // Finish wall, user has to click again for next decoupled wall
        actions.clearPreviewWall();
      }
    }

    // --- Custom Polyline Shape Wall Drawing ---
    if (state.activeTool === 'CUSTOM_SHAPE') {
      e.stopPropagation();
      if (!startPoint) {
        setStartPoint(point);
      } else {
        actions.addWall({ start: startPoint, end: point });
        setStartPoint(point); // Chain next wall to this one
      }
    }

    // --- Room Drawing ---
    if (state.activeTool === 'ROOM') {
      e.stopPropagation();
      if (!startPoint) {
        setStartPoint(point);
      } else {
        const p1 = startPoint;
        const p3 = point;
        const p2 = [p1[0], 0, p3[2]];
        const p4 = [p3[0], 0, p1[2]];
        
        actions.addWalls([
          { start: p1, end: p2 },
          { start: p2, end: p3 },
          { start: p3, end: p4 },
          { start: p4, end: p1 },
        ]);
        setStartPoint(null);
        actions.clearPreviewRoom();
      }
    }

    // --- Floor Drawing ---
    if (state.activeTool === 'FLOOR') {
      e.stopPropagation();
      if (state.previewFloorPoints.length === 0) {
        actions.addFloorPoint(point); // Start
        actions.addFloorPoint(point); // Hover
      } else {
        actions.addFloorPoint(point); // Add fixed point
      }
    }
    
    if (state.activeTool === 'CHANGE_HEIGHT') {
      // clicking empty space deselects
      actions.selectWall(null);
    }
  };

  const handlePointerMove = (e) => {
    const point = [e.point.x, 0, e.point.z];
    setHoverPoint(point);

    if ((state.activeTool === 'WALL' || state.activeTool === 'CUSTOM_SHAPE') && startPoint) {
      actions.updatePreviewWall({ start: startPoint, end: point, height: state.wallHeight });
    }

    if (state.activeTool === 'ROOM' && startPoint) {
      actions.updatePreviewRoom({ start: startPoint, end: point });
    }

    if (state.activeTool === 'FLOOR' && state.previewFloorPoints.length > 0) {
      actions.updateFloorPreviewPoint(point);
    }
  };

  const handleContextMenu = (e) => {
    e.stopPropagation();
    
    if (state.placingFurniture) {
      actions.cancelPlacingFurniture();
      return;
    }

    if (state.activeTool === 'WALL' || state.activeTool === 'CUSTOM_SHAPE') {
      setStartPoint(null);
      actions.clearPreviewWall();
    }

    if (state.activeTool === 'ROOM') {
      setStartPoint(null);
      actions.clearPreviewRoom();
    }

    if (state.activeTool === 'FLOOR') {
      // Remove trailing hover point and finish
      const finalPoints = state.previewFloorPoints.slice(0, -1);
      actions.finishFloor(finalPoints);
    }
  };

  return (
    <group>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.02, 0]} 
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
          instance={{ item: state.placingFurniture, x: hoverPoint[0], z: hoverPoint[2], rotation: 0, id: 'preview' }}
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
      shadows={false}
    >
      <color attach="background" args={['#00000000']} />
      <ambientLight intensity={1.5} />
      
      <InteractionPlane />

      {/* Render Floors */}
      {state.floors.map((f, i) => (
        <Floor key={i} points={f.points} />
      ))}
      
      {/* Floor Preview Highlight */}
      {state.activeTool === 'FLOOR' && state.previewFloorPoints.length > 2 && (
        <Floor points={state.previewFloorPoints} color="#8cc63f" isPreview={true} />
      )}

      {/* Render Existing Walls */}
      {state.walls.map((w, i) => (
        <Wall 
          key={w.id || i} 
          id={w.id}
          start={w.start} 
          end={w.end} 
          height={w.height / 100} 
          thickness={w.thickness ? w.thickness / 100 : 0.2}
          isSelected={state.selectedWallId === w.id}
        />
      ))}

      {/* Render Single Preview Wall */}
      {state.previewWall && (
        <Wall 
          start={state.previewWall.start} 
          end={state.previewWall.end} 
          height={state.wallHeight / 100} 
          thickness={state.wallThickness / 100}
          color="#999" 
          opacity={0.6}
          isPreview={true}
        />
      )}

      {/* Render Room Preview */}
      {state.previewRoom && (
        <group>
          {(() => {
            const p1 = state.previewRoom.start;
            const p3 = state.previewRoom.end;
            const p2 = [p1[0], 0, p3[2]];
            const p4 = [p3[0], 0, p1[2]];
            const th = state.wallThickness / 100;
            const h = state.wallHeight / 100;
            
            return (
              <>
                <Wall start={p1} end={p2} height={h} thickness={th} color="#999" opacity={0.5} isPreview />
                <Wall start={p2} end={p3} height={h} thickness={th} color="#999" opacity={0.5} isPreview />
                <Wall start={p3} end={p4} height={h} thickness={th} color="#999" opacity={0.5} isPreview />
                <Wall start={p4} end={p1} height={h} thickness={th} color="#999" opacity={0.5} isPreview />
              </>
            );
          })()}
        </group>
      )}

      {/* Render Furniture */}
      {state.furniture.map((f) => (
        <Furniture 
          key={f.id} 
          instance={{...f, item: f.item || f}}
        />
      ))}

      <MapControls 
        enableRotate={false} 
        screenSpacePanning={true}
        minZoom={10}
        maxZoom={100}
      />
    </Canvas>
  );
}