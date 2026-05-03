import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { Text, Edges, OrbitControls, MapControls, PerspectiveCamera, OrthographicCamera, GizmoHelper, GizmoViewport, useGLTF, useFBX, Html } from "@react-three/drei";

import { usePlanner, getNearestPointOnSegment, getSnappedFurniture } from "../planner/PlannerContext";
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { ErrorBoundary } from 'react-error-boundary';



const ModelFallback = () => (
  <mesh position={[0, 0.5, 0]}>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color="red" wireframe />
  </mesh>
);

// --- Drop Controller for Furniture & Decorations ---
const DropController = () => {
  const { camera, raycaster, gl, scene } = useThree();
  const { state, actions } = usePlanner();
  const [dragPoint, setDragPoint] = useState(null);

  useEffect(() => {
    const handleDrop = (e) => {
      e.preventDefault();
      setDragPoint(null);

      const furnitureData = e.dataTransfer.getData("furnitureItem");
      const decorationData = e.dataTransfer.getData("decorationItem");

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);

      if (furnitureData) {
        try {
          const item = JSON.parse(furnitureData);
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const targetPos = new THREE.Vector3();

          let intersectionPoint = null;
          let dropElevation = item.elevation || 0;

          const intersects = raycaster.intersectObjects(scene.children, true);
          if (intersects.length > 0) {
            intersectionPoint = intersects[0].point;

            // Check if we hit another piece of furniture to set elevation
            const furnitureObj = intersects.find(i => i.object.userData && i.object.userData.plannerId && String(i.object.userData.plannerId).startsWith('furn_'));
            if (furnitureObj) {
              const targetId = furnitureObj.object.userData.plannerId;
              const target = state.furniture.find(f => f.id === targetId);
              if (target) {
                dropElevation = (target.elevation || 0) + (target.height || 0);
              }
            }
          } else if (raycaster.ray.intersectPlane(plane, targetPos)) {
            intersectionPoint = targetPos;
          }

          if (intersectionPoint) {
            actions.addFurniture({
              item,
              x: Math.round(intersectionPoint.x * 10) / 10,
              z: Math.round(intersectionPoint.z * 10) / 10,
              rotation: 0,
              width: item.width,
              depth: item.depth,
              height: item.height,
              elevation: dropElevation
            });
          }
        } catch (err) { console.error(err); }
      } else if (decorationData) {
        try {
          const decoration = JSON.parse(decorationData);
          const rect = gl.domElement.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera({ x, y }, camera);

          const intersects = raycaster.intersectObjects(scene.children, true);
          // Find the wall or floor that was dropped on
          const target = intersects.find(i => i.object.userData && i.object.userData.plannerId);
          if (target) {
            const plannerId = target.object.userData.plannerId;
            const isWall = plannerId.startsWith('wall_');
            
            if (isWall) {
              // Apply to the entire wall as requested
              const finalDecoration = {
                type: decoration.image ? 'material' : (decoration.value?.startsWith('#') ? 'paint' : 'material'),
                value: decoration.image || decoration.value,
                scale: decoration.defaultScale ? (1 / (decoration.defaultScale * 10)) : 2, // adjust scale for repeating
                ...decoration
              };
              actions.applyDecoration(plannerId, finalDecoration);
            } else {
              actions.applyDecoration(plannerId, decoration);
            }
          }
          actions.setHoveredWallId(null);
        } catch (err) { console.error(err); }

      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      const wallTarget = intersects.find(i => i.object.userData && i.object.userData.plannerId && String(i.object.userData.plannerId).startsWith('wall_'));
      
      if (wallTarget) {
        actions.setHoveredWallId(wallTarget.object.userData.plannerId);
      } else {
        actions.setHoveredWallId(null);
      }

      if (window.currentlyDraggedFurniture) {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const targetPos = new THREE.Vector3();

        let intersectionPoint = null;
        if (intersects.length > 0) {
          intersectionPoint = intersects[0].point;
        } else if (raycaster.ray.intersectPlane(plane, targetPos)) {
          intersectionPoint = targetPos;
        }

        if (intersectionPoint) {
          setDragPoint([Math.round(intersectionPoint.x * 10) / 10, 0, Math.round(intersectionPoint.z * 10) / 10]);
        }
      }
    };

    const domElement = gl.domElement;
    domElement.addEventListener('drop', handleDrop);
    domElement.addEventListener('dragover', handleDragOver);
    domElement.addEventListener('dragleave', () => {
      setDragPoint(null);
      actions.setHoveredWallId(null);
    });


    return () => {
      domElement.removeEventListener('drop', handleDrop);
      domElement.removeEventListener('dragover', handleDragOver);
    };
  }, [camera, gl, raycaster, actions, scene]);

  if (!dragPoint || !window.currentlyDraggedFurniture) return null;

  const snapped = getSnappedFurniture({
    item: window.currentlyDraggedFurniture,
    x: dragPoint[0],
    z: dragPoint[2],
    rotation: 0
  }, state.walls);

  // For windows and doors, only show preview if snapped to a wall
  const isTypeRestricted = window.currentlyDraggedFurniture.type === 'WINDOW' || window.currentlyDraggedFurniture.type === 'DOOR';
  if (isTypeRestricted && !snapped.isSnapped) return null;

  return (
    <React.Suspense fallback={null}>
      <Furniture
        instance={snapped}
        isPreview={true}
      />
    </React.Suspense>
  );
};

// --- Textured Material ---
const TexturedMaterial = ({ decoration, isSelected, isWall = false, width = 1, height = 1 }) => {
  const [opacity, setOpacity] = useState(1);
  const [activeDecoration, setActiveDecoration] = useState(decoration);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle fade transition when decoration changes
  useEffect(() => {
    if (JSON.stringify(decoration) !== JSON.stringify(activeDecoration)) {
      setIsAnimating(true);
      setOpacity(0);
      const timer = setTimeout(() => {
        setActiveDecoration(decoration);
        setOpacity(1);
        setIsAnimating(false);
      }, 300); // Duration of fade-out before switching
      return () => clearTimeout(timer);
    }
  }, [decoration, activeDecoration]);

  const textureUrl = activeDecoration?.type === 'material' ? activeDecoration.value : (activeDecoration?.image ? activeDecoration.image : null);
  const texture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;


  useMemo(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      
      // Determine the real-world size of one tile in meters
      let baseTileSize = 1.0; 
      if (activeDecoration?.defaultScale) {
        baseTileSize = activeDecoration.defaultScale * 550;
      }

      // Apply the user-defined scale multiplier (materialScale from slider)
      const userScale = activeDecoration?.materialScale || 1.0;
      const tileSize = baseTileSize * userScale;

      // Calculate repeat based on real-world dimensions
      const repeatX = width / tileSize;
      const repeatY = height / tileSize;
      
      texture.repeat.set(repeatX, repeatY);
      texture.rotation = (activeDecoration?.materialRotation || 0) * (Math.PI / 180);
      texture.center.set(0.5, 0.5); // Rotate around center
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture, activeDecoration?.scale, activeDecoration?.defaultScale, activeDecoration?.materialScale, activeDecoration?.materialRotation, width, height]);

  const props = useMemo(() => {
    if (!activeDecoration) return { color: isSelected ? "#e6f2d5" : (isWall ? "#b0b0b0" : "#d0d0d0") };
    if (activeDecoration.type === 'paint') return { color: activeDecoration.value };
    if (texture) return { map: texture, color: "#ffffff" };
    if (activeDecoration.type === 'gradient') return { color: "#ffffff" };
    return { color: "#ffffff" };
  }, [activeDecoration, isSelected, texture, isWall]);



  return <meshStandardMaterial 
    {...props} 
    transparent={isAnimating || opacity < 1}
    opacity={opacity}
    side={THREE.DoubleSide} 
    roughness={activeDecoration?.type === 'material' ? 0.4 : 0.8} // Tiles are glossier, paint is matte
    metalness={activeDecoration?.type === 'material' ? 0.1 : 0.0} 
    transition="opacity 0.3s ease-in-out" 
  />;
};


// --- Wall Component ---
const Wall = ({ id, start, end, height, thickness = 0.2, decoration, isPreview = false, isSelected = false, viewMode = '2D' }) => {
  const { state, actions } = usePlanner();
  const isHovered = state.hoveredWallId === id;


  const openings = useMemo(() => {
    return state.furniture.filter(f => {
      if (!f.item || (f.item.type !== 'WINDOW' && f.item.type !== 'DOOR' && f.item.id !== 'tv')) return false;
      if (f.snappedWallId) return f.snappedWallId === id;
      const nearest = getNearestPointOnSegment([f.x, 0, f.z], start, end);
      const dist = Math.sqrt(Math.pow(f.x - nearest[0], 2) + Math.pow(f.z - nearest[2], 2));
      return dist < 0.2;
    });
  }, [state.furniture, start, end, id]);

  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  if (length < 0.01) return null;

  const angle = Math.atan2(dz, dx);
  const cx = (start[0] + end[0]) / 2;
  const cz = (start[2] + end[2]) / 2;

  const displayHeight = viewMode === '2D' ? 0.05 : height;
  const cy = viewMode === '2D' ? -0.025 : displayHeight / 2;

  const textOffset = thickness / 2 + 0.4;
  const perpX = -Math.sin(angle);
  const perpZ = Math.cos(angle);
  const textX = cx + perpX * textOffset;
  const textZ = cz + perpZ * textOffset;

  const renderWallMesh = () => {
    const wallH = displayHeight;
    const wallY = cy;

    const sortedOpenings = openings
      .map(op => {
        const nearest = getNearestPointOnSegment([op.x, 0, op.z], start, end);
        const distFromStart = Math.sqrt(Math.pow(nearest[0] - start[0], 2) + Math.pow(nearest[2] - start[2], 2));
        return { ...op, wallDist: distFromStart };
      })
      .sort((a, b) => a.wallDist - b.wallDist);

    const segments = [];
    let currentX = 0;
    const totalHeightM = height;

    sortedOpenings.forEach((op) => {
      const opWidth = (op.item.width || 100) / 100;
      const isTV = op.item.id === 'tv';
      let opHeight = (op.item.height || 200) / 100;
      if (op.item.isArched) {
        opHeight -= (op.item.archDrop || 0) / 100;
      }
      const opElevation = (op.elevation !== undefined ? op.elevation : (op.item.elevation || 0)) / 100;

      const opHalfWidth = opWidth / 2;
      const opXStart = Math.max(0, op.wallDist - opHalfWidth);
      const opXEnd = Math.min(length, op.wallDist + opHalfWidth);
      const actualOpWidth = opXEnd - opXStart;
      const actualOpX = (opXStart + opXEnd) / 2;

      const lateralLen = opXStart - currentX;
      if (lateralLen > 0.01) {
        segments.push({ pos: currentX + lateralLen / 2, len: lateralLen, h: wallH, y: wallY });
      }

      if (viewMode === '3D') {
        const openingTop = opElevation + opHeight;
        if (openingTop < totalHeightM) {
          const headerH = totalHeightM - openingTop;
          segments.push({ pos: actualOpX, len: actualOpWidth, h: headerH, y: openingTop + headerH / 2 });
        }
        if (opElevation > 0.01) {
          segments.push({ pos: actualOpX, len: actualOpWidth, h: opElevation, y: opElevation / 2 });
        }
        // If it's a TV, add a backing segment to keep the wall solid from the outside
        if (isTV) {
          segments.push({ pos: actualOpX, len: actualOpWidth, h: opHeight, y: opElevation + opHeight / 2, isNicheBack: true });
        }
      }
      currentX = opXEnd;
    });

    const finalLen = length - currentX;
    if (finalLen > 0.01) {
      segments.push({ pos: currentX + finalLen / 2, len: finalLen, h: wallH, y: wallY });
    }

    return (
      <group position={[start[0], 0, start[2]]} rotation={[0, -angle, 0]}>
        {segments.map((seg, i) => (
          <mesh
            key={i}
            position={[seg.pos, seg.y, seg.isNicheBack ? -thickness / 4 : 0]}
            castShadow
            receiveShadow={!isPreview}
            userData={{ plannerId: id }}
            onClick={(e) => {
              if (isPreview) return;
              e.stopPropagation();
              actions.selectWall(id);
            }}
          >
            <boxGeometry args={[seg.len, seg.h, seg.isNicheBack ? thickness / 2 : thickness]} />
            <React.Suspense fallback={<meshStandardMaterial color="#ccc" />}>
              <TexturedMaterial 
                decoration={decoration} 
                isSelected={isSelected || isHovered} 
                isWall={true} 
                width={seg.len} 
                height={seg.h} 
              />
            </React.Suspense>

            {(isSelected || isHovered || viewMode === '2D') && (
              <Edges
                color={isSelected ? "#8cc63f" : (isHovered ? "#ffffff" : "#555555")}
                threshold={15}
              />
            )}
          </mesh>
        ))}
      </group>

    );
  };

  return (
    <group>
      {renderWallMesh()}
      {!isPreview && viewMode === '2D' && (
        <>
          <mesh position={[start[0], displayHeight, start[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[thickness * 0.8, 16]} />
            <meshBasicMaterial color="#999" />
          </mesh>
          <mesh position={[end[0], displayHeight, end[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[thickness * 0.8, 16]} />
            <meshBasicMaterial color="#999" />
          </mesh>
          <Text
            position={[textX, displayHeight + 0.1, textZ]}
            rotation={[-Math.PI / 2, 0, -angle]}
            fontSize={0.4}
            color="#333"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
          >
            {(length * 100).toFixed(0)}
          </Text>
        </>
      )}
    </group>
  );
};

// --- Floor Component ---
const Floor = ({ id, points, decoration, isPreview = false }) => {
  const { actions } = usePlanner();
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
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
      userData={{ plannerId: id }}
      onClick={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        if (id) actions.selectWall(id);
      }}
    >
      <shapeGeometry args={[shape]} />
      <React.Suspense fallback={<meshStandardMaterial color="#fffde7" />}>
        <TexturedMaterial 
          decoration={decoration} 
          isSelected={false} 
          isWall={false} 
          width={10} // Approximation for floors, could be improved by calculating bbox
          height={10} 
        />
      </React.Suspense>

      <Edges color="#ddd" />
    </mesh>
  );
};

// --- Model Loader ---
const FBXModel = ({ url, item, scale, rotation, isPreview }) => {
  const fbx = useFBX(url);
  const { state } = usePlanner();
  
  // Load custom texture if provided
  const customTexture = item.texture ? useLoader(THREE.TextureLoader, item.texture) : null;
  if (customTexture) {
    customTexture.wrapS = customTexture.wrapT = THREE.RepeatWrapping;
  }

  const centeredScene = useMemo(() => {
    const clone = SkeletonUtils.clone(fbx);
    const itemId = (item.id || "").toLowerCase();
    const isStair = itemId.includes('stair');
    const isFireplace = itemId.includes('fireplace');

    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = !isPreview;
        node.receiveShadow = !isPreview;
        node.userData = { plannerId: item.instanceId || item.id };
        
        if (customTexture && node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(m => {
            m.map = customTexture;
            m.needsUpdate = true;
          });
        }

        if (node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(m => {
            m.side = THREE.DoubleSide;
            m.shadowSide = THREE.FrontSide;

            // Standard depth settings to avoid glitches
            m.depthWrite = true;
            m.depthTest = true;

            const matName = (m.name || "").toLowerCase();
            let isGlass = matName.includes('glass') || matName.includes('vidrio') || matName.includes('vitre') || (m.opacity !== undefined && m.opacity < 1);

            // ... (rest of glass logic remains same)


            if (item.id === 'door3') {
              isGlass = false;
              // Reset opacity in case the FBX exported it as less than 1
              m.opacity = 1;
              m.transparent = false;
            }
            if (item.id === 'door1') {
              isGlass = false;
              m.opacity = 1;
              m.transparent = false;
              // Set a warm wood color for the door frame
              m.color.setHex(0x8b4513);
            }


            if (isGlass) {
              m.transparent = true;
              m.opacity = 0.3;
              m.color.setHex(0x88ccff); // Light blue tint for glass
              m.roughness = 0.1;
              m.metalness = 0.8;
              m.depthWrite = false;
            } else if (item.type === 'WINDOW' && !m.map) {
              // If it's a window frame without a texture, give it a nice white/off-white color instead of default grey
              // Only apply if the current color is pure white or pure grey to avoid overriding custom colors
              if (m.color.r === m.color.g && m.color.g === m.color.b) {
                m.color.setHex(0xf5f5f5);
              }
            }

            if (itemId.includes('sink') || itemId.includes('toilet') || itemId.includes('bathtub') || itemId.includes('lamp')) { m.roughness = 0.1; m.metalness = 0.1; }
            else if (itemId.includes('tap')) { m.roughness = 0.2; m.metalness = 0.8; }
            else if (itemId.includes('stove')) {
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach((m) => {
                const nodeName = (node.name || "").toLowerCase();
                const matName = (m.name || "").toLowerCase();

                // Heuristic for burners/knobs/grates
                const isBlackPart = nodeName.includes('burn') || nodeName.includes('knob') ||
                  nodeName.includes('grate') || nodeName.includes('glass') ||
                  matName.includes('burn') || matName.includes('knob') ||
                  matName.includes('grate') || matName.includes('glass');

                m.map = null;
                m.vertexColors = false;

                if (isBlackPart) {
                  m.color.set(0x333333); // Dark Grey
                } else {
                  m.color.set(0xcccccc); // Light Grey Body
                }
                m.roughness = 0.2;
                m.metalness = 0.4;
                m.needsUpdate = true;
              });
            }
            else if (itemId.includes('fridge')) {
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach((m) => {
                const nodeName = (node.name || "").toLowerCase();
                const matName = (m.name || "").toLowerCase();

                // Heuristic for handles/accents
                const isAccent = nodeName.includes('handle') || nodeName.includes('door') ||
                  matName.includes('handle') || matName.includes('door') ||
                  nodeName.includes('knob') || matName.includes('knob');

                m.map = null;
                m.vertexColors = false;

                if (isAccent) {
                  m.color.set(0xffffff); // Pure White Handles/Accents
                } else {
                  m.color.set(0x81b1ce); // Restoring Navy Blue Body
                }
                m.roughness = 0.2;
                m.metalness = 0.5;
                m.needsUpdate = true;
              });
            }

            if (isFireplace) {
              if (!m.map || (m.color.r < 0.1 && m.color.g < 0.1 && m.color.b < 0.1)) {
                m.color.setHex(0xe8e8e8); // Light stone/grey color
              }
              m.roughness = 0.9;
              m.metalness = 0.1;
            }
          });
          if (itemId.includes('bed3')) {
            const bedColors = [0x1f3b4d, 0x8b5a2b, 0x8fbc8f]; // Navy Blue, Wood Brown, Dark Sea Green
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach(m => {
              if (!m.bedColorAssigned) {
                const nName = (node.name || "").toLowerCase();
                const mName = (m.name || "").toLowerCase();

                // If the mesh is a curtain, make it Cream colored
                if (nName.includes('curtain') || mName.includes('curtain') || nName.includes('drape') || mName.includes('drape') || nName.includes('net') || nName.includes('cloth')) {
                  m.color.setHex(0xfffdd0); // Cream
                  m.transparent = true;
                  m.opacity = 0.9;
                } else {
                  m.color.setHex(bedColors[Math.floor(Math.random() * 3)]);
                }
                m.bedColorAssigned = true;
              }
            });
          }
          if (itemId.includes('bed2')) {
            const bed2Colors = [0x1f3b4d, 0xf5f5f5]; // Navy Blue and White/Cream
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach(m => {
              if (!m.colorAssigned) {
                m.color.setHex(bed2Colors[Math.floor(Math.random() * 2)]);
                m.colorAssigned = true;
              }
            });
          }

          if (itemId.includes('wardrobe') || itemId.includes('cabinet')) {
            const wardrobeColors = [0xd2b48c, 0x5d4037]; // Light Oak and Dark Walnut (Wood)
            const mats = Array.isArray(node.material) ? node.material : [node.material];

            mats.forEach((m, index) => {
              // ALWAYS override if it's too dark (blackish) or if we want to force dual color
              const isBlackish = m.color.r < 0.1 && m.color.g < 0.1 && m.color.b < 0.1;

              if (!m.colorAssigned || isBlackish) {
                const nodeName = (node.name || "").toLowerCase();
                const matName = (m.name || "").toLowerCase();

                // Enhanced heuristic for dual color: doors/fronts vs frame
                const isDoor = nodeName.includes('door') || nodeName.includes('front') || nodeName.includes('panel') ||
                  matName.includes('door') || matName.includes('front') || matName.includes('panel');

                const isHandle = nodeName.includes('handle') || nodeName.includes('knob') ||
                  matName.includes('handle') || matName.includes('knob');

                if (isDoor) {
                  m.color.setHex(0xd2b48c); // Light Oak for doors
                } else if (isHandle) {
                  m.color.setHex(0x1a1a1a); // Black/Metallic for handles
                } else if (nodeName.includes('frame') || nodeName.includes('body') || nodeName.includes('side') || nodeName.includes('top')) {
                  m.color.setHex(0x5d4037); // Dark Walnut for body
                } else {
                  // Fallback: use index to alternate colors if names don't match
                  // This ensures even models with bad naming get a dual-tone look
                  m.color.setHex(wardrobeColors[index % 2]);
                }

                m.colorAssigned = true;
              }
              m.roughness = 0.5;
              m.metalness = 0.1;
            });
          }

          if (itemId.includes('table')) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m, index) => {
              const nodeName = (node.name || "").toLowerCase();
              const matName = (m.name || "").toLowerCase();

              const isTop = nodeName.includes('top') || nodeName.includes('surface') || nodeName.includes('board') ||
                matName.includes('top') || matName.includes('surface') || matName.includes('board');

              const isLeg = nodeName.includes('leg') || nodeName.includes('frame') || nodeName.includes('base') ||
                matName.includes('leg') || matName.includes('frame') || matName.includes('base');

              if (isTop) {
                m.color.set(0xe3c5a8);
              } else if (isLeg) {
                m.color.set(0x3e2723);
              } else {
                m.color.set(index === 0 ? 0xe3c5a8 : 0x3e2723);
              }

              m.roughness = 0.5;
              m.metalness = 0.1;
              m.vertexColors = false;
              m.colorAssigned = true;
              m.needsUpdate = true;
            });
          }

          if (itemId.includes('chair')) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m, index) => {
              const nodeName = (node.name || "").toLowerCase();
              const matName = (m.name || "").toLowerCase();

              const isSeat = nodeName.includes('seat') || nodeName.includes('back') || nodeName.includes('cushion') ||
                             matName.includes('seat') || matName.includes('back') || matName.includes('cushion') ||
                             nodeName.includes('wood') || matName.includes('wood');
              
              const isLeg = nodeName.includes('leg') || nodeName.includes('frame') || nodeName.includes('base') ||
                            matName.includes('leg') || matName.includes('frame') || matName.includes('base');

              m.map = null;
              m.vertexColors = false;

              if (isSeat) {
                m.color.set(0x8b4513); // Wooden Brown
              } else if (isLeg) {
                m.color.set(0x222222); // Black Frame
              } else {
                m.color.set(index === 0 ? 0x8b4513 : 0x222222);
              }
              
              m.roughness = 0.6;
              m.metalness = 0.1;
              m.needsUpdate = true;
            });
          }

          if (itemId.includes('bathtub')) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m, index) => {
              const nodeName = (node.name || "").toLowerCase();
              const matName = (m.name || "").toLowerCase();

              const isMetallic = nodeName.includes('tap') || nodeName.includes('handle') || nodeName.includes('drain') ||
                nodeName.includes('feet') || nodeName.includes('leg') ||
                matName.includes('metal') || matName.includes('chrome') || matName.includes('silver');

              // Force clear existing maps and vertex colors to fix black appearance
              m.map = null;
              m.vertexColors = false;

              if (isMetallic) {
                m.color.set(0xc0c0c0); // Silver
                m.metalness = 0.9;
                m.roughness = 0.1;
              } else {
                m.color.set(0xffffff); // White
                m.metalness = 0.1;
                m.roughness = 0.1;
              }
              m.colorAssigned = true;
              m.needsUpdate = true;
            });
          }

          if (itemId === 'lamp1' || itemId === 'lamp2') {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m) => {
              const nodeName = (node.name || "").toLowerCase();
              const matName = (m.name || "").toLowerCase();

              // Heuristic to separate shade from stand
              const isShade = nodeName.includes('shade') || nodeName.includes('head') || nodeName.includes('lamp') ||
                matName.includes('shade') || matName.includes('head') || matName.includes('lamp');

              m.map = null;
              m.vertexColors = false;

              if (itemId === 'lamp1') {
                if (isShade) {
                  m.color.set(0x222222); // Black Shade
                  m.roughness = 0.5;
                } else {
                  m.color.set(0x8b4513); // Wooden Brown Stand
                  m.roughness = 0.8;
                }
              } else if (itemId === 'lamp2') {
                if (isShade) {
                  m.color.set(0xffffff); // Pure White Shade
                  m.roughness = 0.3;
                } else {
                  m.color.set(0x000000); // Black Stand
                  m.roughness = 0.5;
                }
              }
              m.needsUpdate = true;
            });
          }

          if (itemId.includes('toilet')) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m) => {
              m.map = null;
              m.vertexColors = false;
              m.color.set(0xffffff); // White
              m.metalness = 0.0;
              m.roughness = 0.1;
              m.needsUpdate = true;
            });
          }

          if (itemId === 'sink2' || itemId.includes('washbasin')) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m, index) => {
              const nodeName = (node.name || "").toLowerCase();
              const matName = (m.name || "").toLowerCase();

              const isMetallic = nodeName.includes('tap') || nodeName.includes('handle') || nodeName.includes('faucet') ||
                matName.includes('metal') || matName.includes('chrome') || matName.includes('silver');

              const isCabinet = nodeName.includes('cabinet') || nodeName.includes('table') || nodeName.includes('base') ||
                nodeName.includes('stand') || nodeName.includes('drawer') || nodeName.includes('wood') ||
                nodeName.includes('pedestal') ||
                matName.includes('cabinet') || matName.includes('table') || matName.includes('base') ||
                matName.includes('stand') || matName.includes('wood') || matName.includes('pedestal');

              const isBasin = nodeName.includes('basin') || nodeName.includes('sink') || nodeName.includes('bowl') ||
                nodeName.includes('vessel') || nodeName.includes('top') ||
                matName.includes('basin') || matName.includes('sink') || matName.includes('bowl') ||
                matName.includes('ceramic') || matName.includes('white');

              // Force clear existing maps and vertex colors
              m.map = null;
              m.vertexColors = false;

              if (isMetallic) {
                m.color.set(0xc0c0c0); // Silver
                m.metalness = 0.9;
                m.roughness = 0.1;
              } else if (isCabinet) {
                // It's the table/cabinet/pedestal part
                m.color.set(0x8b4513); // Brown
                m.metalness = 0.0;
                m.roughness = 0.8;
              } else {
                // Default to white for the basin/sink bowl
                m.color.set(0xffffff); // White
                m.metalness = 0.0;
                m.roughness = 0.1;
              }
              m.colorAssigned = true;
              m.needsUpdate = true;
            });
          }
        }
      }
    });

    if (rotation) {
      clone.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    const innerWrapper = new THREE.Group();
    innerWrapper.add(clone);
    innerWrapper.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(innerWrapper);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    innerWrapper.position.x = -center.x;
    innerWrapper.position.z = -center.z;
    innerWrapper.position.y = -box.min.y;

    const wrapper = new THREE.Group();
    wrapper.add(innerWrapper);

    if (item.type === 'WINDOW' || item.type === 'DOOR' || isStair || isFireplace) {
      const targetW = (item.width || 100) / 100;
      let targetH = (item.height || 100) / 100;
      if (isStair) targetH = (state.wallHeight / 100);

      let targetD = (item.depth || 10) / 100;

      if (item.type === 'WINDOW' || item.type === 'DOOR') {
        targetD += 0.04;
      }

      const scaleX = size.x > 0 ? targetW / size.x : 1;
      const scaleY = size.y > 0 ? targetH / size.y : 1;
      const scaleZ = size.z > 0 ? targetD / size.z : 1;
      wrapper.scale.set(scaleX, scaleY, scaleZ);
    } else if (scale) {
      wrapper.scale.set(...scale);
    }

    return wrapper;
  }, [fbx, item, scale, rotation, state.wallHeight, isPreview]);

  return <primitive object={centeredScene} />;
};

// --- Furniture Component ---
const Furniture = ({ instance, isPreview = false }) => {
  const { item, x, z, rotation = 0, id, isSelected } = instance;
  const { state, actions } = usePlanner();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const modelUrl = item.model;
  const isFBX = modelUrl && modelUrl.split('?')[0].toLowerCase().endsWith('.fbx');

  const handlePointerDown = (e) => {
    if (isPreview || state.activeTool || state.placingFurniture) return;
    e.stopPropagation();
    
    // Select the furniture immediately
    actions.selectFurniture(id);
    
    setIsDragging(true);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetPos = new THREE.Vector3();
    if (e.raycaster.ray.intersectPlane(plane, targetPos)) {
      setDragStart({ x: targetPos.x - x, z: targetPos.z - z });
    } else {
      setDragStart({ x: e.point.x - x, z: e.point.z - z });
    }

    if (e.target && e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
  };


  const handlePointerMove = (e) => {
    if (!isDragging || !dragStart) return;
    e.stopPropagation();

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetPos = new THREE.Vector3();
    if (e.raycaster.ray.intersectPlane(plane, targetPos)) {
      actions.updateFurniture(id, { x: targetPos.x - dragStart.x, z: targetPos.z - dragStart.z }, false);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    setDragStart(null);
    e.target.releasePointerCapture(e.pointerId);
    // Save history on release
    actions.saveToHistory();
  };

  const handleContextMenu = (e) => {
    if (isPreview || state.activeTool || state.placingFurniture) return;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    actions.updateFurniture(id, { rotation: rotation + Math.PI / 8 });
  };

  // Add a small Y offset for items to prevent Z-fighting with the floor
  const yBase = (instance.elevation || 0) / 100;
  const yPos = state.viewMode === '2D' ? yBase + 0.1 : yBase + 0.001;

  return (
    <group
      position={[x, yPos, z]}
      rotation={[0, rotation, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      onClick={(e) => {
        if (isPreview || state.activeTool || state.placingFurniture) return;
        e.stopPropagation();
        actions.selectFurniture(id);
      }}
    >
      {/* Hit-box for reliable selection - increased size and visible to raycaster */}
      <mesh position={[0, (item.height || 100) / 200, 0]} userData={{ plannerId: id }}>
        <boxGeometry args={[item.width / 100 + 0.1, (item.height || 100) / 100 + 0.1, item.depth / 100 + 0.1]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>


      <ErrorBoundary FallbackComponent={ModelFallback}>

        <React.Suspense fallback={<mesh position={[0, 0.5, 0]}><boxGeometry args={[item.width / 100, 1, item.depth / 100]} /><meshStandardMaterial color="#ccc" transparent opacity={0.5} /></mesh>}>
          {isFBX ? (
            <FBXModel url={modelUrl} item={{ ...item, instanceId: id }} scale={item.modelScale || [0.01, 0.01, 0.01]} rotation={item.modelRotation || [0, 0, 0]} isPreview={isPreview || isDragging} />
          ) : (
            <mesh position={[0, (item.height || 100) / 200, 0]} castShadow={!(isPreview || isDragging)} receiveShadow={!(isPreview || isDragging)} userData={{ plannerId: id }}>
              <boxGeometry args={[item.width / 100, (item.height || 100) / 100, item.depth / 100]} />
              <meshStandardMaterial color={item.color || "#ccc"} />
              <Edges color="#333" />
            </mesh>
          )}
        </React.Suspense>
      </ErrorBoundary>
      {isSelected && !isPreview && (
        <Html center position={[0, (item.height || 100) / 100 + 0.5, 0]}>
          <div className="furniture-edit-menu">
            <button title="Rotate Left" onClick={(e) => { e.stopPropagation(); actions.updateFurniture(id, { rotation: rotation - Math.PI / 8 }); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>
            </button>
            <button title="Rotate Right" onClick={(e) => { e.stopPropagation(); actions.updateFurniture(id, { rotation: rotation + Math.PI / 8 }); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
            </button>
            <button title="Delete" className="delete-btn" onClick={(e) => { e.stopPropagation(); actions.removeFurniture(id); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </Html>
      )}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[Math.max(item.width, item.depth) / 100, Math.max(item.width, item.depth) / 100 + 0.1, 32]} />
          <meshBasicMaterial color="#8cc63f" transparent opacity={0.5} />
        </mesh>
      )}

    </group>
  );
};

// --- Interaction Plane ---
const InteractionPlane = () => {
  const { state, actions } = usePlanner();
  const [startPoint, setStartPoint] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const snapToGrid = (val) => Math.round(val * 10) / 10;

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    const point = [snapToGrid(e.point.x), 0, snapToGrid(e.point.z)];
    setIsDragging(true);

    if (state.placingFurniture) {
      actions.addFurniture({ item: state.placingFurniture, x: point[0], z: point[2], rotation: 0 });
      return;
    }

    // Deselect everything when clicking on empty ground
    actions.selectWall(null);
    actions.selectFurniture(null);


    // If no tool is active, don't start any drawing
    if (!state.activeTool) return;

    if (state.activeTool === 'WALL' || state.activeTool === 'CUSTOM_SHAPE') {
      if (!startPoint) {
        setStartPoint(point);
      } else {
        if (point[0] === startPoint[0] && point[2] === startPoint[2]) return;
        actions.addWall({ start: startPoint, end: point });
        setStartPoint(point); // Chain walls
      }
    }

    if (state.activeTool === 'ROOM') {
      setStartPoint(point);
    }

    if (state.activeTool === 'FLOOR') {
      if (state.previewFloorPoints.length === 0) { actions.addFloorPoint(point); actions.addFloorPoint(point); }
      else {
        const start = state.previewFloorPoints[0];
        const dist = Math.sqrt(Math.pow(point[0] - start[0], 2) + Math.pow(point[2] - start[2], 2));
        if (dist < 0.2 && state.previewFloorPoints.length > 3) actions.finishFloor(state.previewFloorPoints.slice(0, -1));
        else actions.addFloorPoint(point);
      }
    }
  };

  const handlePointerMove = (e) => {
    const point = [snapToGrid(e.point.x), 0, snapToGrid(e.point.z)];
    setHoverPoint(point);
    if ((state.activeTool === 'WALL' || state.activeTool === 'CUSTOM_SHAPE') && startPoint) actions.updatePreviewWall({ start: startPoint, end: point });
    if (state.activeTool === 'ROOM' && startPoint && isDragging) actions.updatePreviewRoom({ start: startPoint, end: point });
    if (state.activeTool === 'FLOOR' && state.previewFloorPoints.length > 0) actions.updateFloorPreviewPoint(point);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const point = [snapToGrid(e.point.x), 0, snapToGrid(e.point.z)];

    if (state.activeTool === 'ROOM' && startPoint) {
      const p1 = startPoint;
      const p3 = point;
      if (Math.abs(p3[0] - p1[0]) < 0.2 || Math.abs(p3[2] - p1[2]) < 0.2) {
        setStartPoint(null);
        actions.clearPreviewRoom();
        return;
      }
      const p2 = [p1[0], 0, p3[2]];
      const p4 = [p3[0], 0, p1[2]];
      actions.addWalls([{ start: p1, end: p2 }, { start: p2, end: p3 }, { start: p3, end: p4 }, { start: p4, end: p1 }]);
      actions.finishFloor([p1, p2, p3, p4]);
      setStartPoint(null);
      actions.clearPreviewRoom();
    }
  };

  const handleDoubleClick = (e) => {
    if (state.activeTool === 'WALL' || state.activeTool === 'CUSTOM_SHAPE' || state.activeTool === 'ROOM') {
      setStartPoint(null);
      actions.clearPreviewWall();
      actions.clearPreviewRoom();
      actions.setTool(null); // Finish drawing
    }
  };

  const handleContextMenu = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStartPoint(null);
    setIsDragging(false);
    actions.clearPreviewWall();
    actions.clearPreviewRoom();
    actions.cancelFloor();
    actions.cancelPlacingFurniture();
    actions.setTool(null);
  };

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <planeGeometry args={[2000, 2000]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>
      {state.placingFurniture && hoverPoint && (() => {
        const snapped = getSnappedFurniture({ item: state.placingFurniture, x: hoverPoint[0], z: hoverPoint[2], rotation: 0 }, state.walls);
        const isTypeRestricted = state.placingFurniture.type === 'WINDOW' || state.placingFurniture.type === 'DOOR';
        if (isTypeRestricted && !snapped.isSnapped) return null;
        return (
          <React.Suspense fallback={null}>
            <Furniture instance={snapped} isPreview={true} />
          </React.Suspense>
        );
      })()}
    </group>
  );
};

export default function PlannerCanvas() {
  const { state } = usePlanner();

  if (!state) return <div style={{ background: '#eee', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Planner...</div>;

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.8
        }}


        onContextMenu={(e) => e.preventDefault()}
      >
        <color attach="background" args={['#fafafa']} />
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[15, 30, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.001}
          shadow-normalBias={0.02}
        >

          <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20, 1, 50]} />
        </directionalLight>
        <DropController />
        <gridHelper args={[200, 200, "#bbbbbb", "#e8e8e8"]} position={[0, -0.015, 0]} />
        {state.viewMode === '3D' && (
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['#ff3653', '#0adb46', '#2c8fff']} labelColor="white" />
          </GizmoHelper>
        )}
        {state.viewMode === '2D' ? (
          <>
            <OrthographicCamera makeDefault position={[0, 100, 0]} zoom={40} up={[0, 0, -1]} far={2000} near={0.5} />
            <MapControls makeDefault enableRotate={false} enabled={!state.activeTool && !state.placingFurniture} />
          </>
        ) : (
          <>
            <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} far={2000} near={0.1} />
            <OrbitControls 
              makeDefault 
              target={[0, 0, 0]} 
              minDistance={2} 
              maxDistance={100} 
              enabled={!state.activeTool && !state.placingFurniture && !state.selectedFurnitureId} 
            />
          </>
        )}

        <InteractionPlane />
        {state.floors.map(f => <Floor key={f.id} id={f.id} points={f.points} decoration={f.decoration} />)}
        {state.activeTool === 'FLOOR' && state.previewFloorPoints.length > 2 && <Floor points={state.previewFloorPoints} isPreview={true} />}
        {state.walls.map(w => (
          <Wall
            key={w.id}
            id={w.id}
            start={w.start}
            end={w.end}
            height={w.height / 100}
            thickness={w.thickness / 100}
            decoration={w.decoration}
            isSelected={state.selectedWallId === w.id}
            viewMode={state.viewMode}
          />
        ))}
        {state.previewWall && <Wall start={state.previewWall.start} end={state.previewWall.end} height={state.wallHeight / 100} thickness={state.wallThickness / 100} isPreview viewMode={state.viewMode} />}
        {state.previewRoom && (
          <group>
            <Wall start={state.previewRoom.start} end={[state.previewRoom.start[0], 0, state.previewRoom.end[2]]} height={state.wallHeight / 100} thickness={state.wallThickness / 100} isPreview viewMode={state.viewMode} />
            <Wall start={[state.previewRoom.start[0], 0, state.previewRoom.end[2]]} end={state.previewRoom.end} height={state.wallHeight / 100} thickness={state.wallThickness / 100} isPreview viewMode={state.viewMode} />
            <Wall start={state.previewRoom.end} end={[state.previewRoom.end[0], 0, state.previewRoom.start[2]]} height={state.wallHeight / 100} thickness={state.wallThickness / 100} isPreview viewMode={state.viewMode} />
            <Wall start={[state.previewRoom.end[0], 0, state.previewRoom.start[2]]} end={state.previewRoom.start} height={state.wallHeight / 100} thickness={state.wallThickness / 100} isPreview viewMode={state.viewMode} />
          </group>
        )}
        {state.furniture.map(f => (
          <Furniture key={f.id} instance={f} isSelected={state.selectedFurnitureId === f.id} />
        ))}
      </Canvas>

    </div>
  );
}