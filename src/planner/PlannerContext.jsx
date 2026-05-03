import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

const MAX_HISTORY = 50;

// --- Snapping Logic for Windows/Doors ---
export const getSnappedFurniture = (instance, allWalls, previousInstance = null) => {
  const item = instance.item;
  if (!item) return instance;
  
  const isWindowOrDoor = item.type === 'WINDOW' || item.type === 'DOOR';
  let nearestWall = null;
  let minDist = Infinity;

  // 1. Proximity Check with Hysteresis
  allWalls.forEach(wall => {
    const nearest = getNearestPointOnSegment([instance.x, 0, instance.z], wall.start, wall.end);
    const dist = Math.hypot(instance.x - nearest[0], instance.z - nearest[2]);
    
    let effectiveDist = dist;
    // Hysteresis: heavily bias towards the currently snapped wall to prevent flickering
    if (previousInstance && previousInstance.snappedWallId === wall.id) {
      effectiveDist -= 0.5; // Require another wall to be clearly closer
    } else if (instance.snappedWallId === wall.id) {
      effectiveDist -= 0.5;
    }

    const halfDepth = (item.depth || 100) / 200;
    // Furniture snaps only when very close (0.2m), Windows/Doors/TV snap from further (0.5m)
    const snapRadius = (isWindowOrDoor || item.id === 'tv') ? 0.5 : 0.2;
    if (effectiveDist < snapRadius && effectiveDist < minDist) { // Search radius for walls
      minDist = effectiveDist;
      nearestWall = wall;
    }
  });

  // 2. Strict Constraints: Retain last valid if no wall
  if (!nearestWall) {
    if (previousInstance && previousInstance.isSnapped) {
      return { ...previousInstance };
    }
    // If no previous instance (e.g. preview drop), mark as unsnapped so it's hidden
    return { ...instance, isSnapped: false };
  }

  // 3. Centerline Projection & Clamping
  const start = nearestWall.start;
  const end = nearestWall.end;
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.hypot(dx, dz);
  
  if (length === 0) return instance; // Invalid wall

  const dirX = dx / length;
  const dirZ = dz / length;

  const px = instance.x;
  const pz = instance.z;

  const vx = px - start[0];
  const vz = pz - start[2];

  let t = (vx * dirX + vz * dirZ);

  const halfWidth = (item.width || 100) / 200; // cm to meters, divided by 2
  if (t < halfWidth) t = halfWidth;
  if (t > length - halfWidth) t = length - halfWidth;

  // 4. Grid Snapping along wall (0.1m)
  const grid = 0.1;
  t = Math.round(t / grid) * grid;

  const projX = start[0] + dirX * t;
  const projZ = start[2] + dirZ * t;

  // 5. Normal Vector & Surface Offset
  const diffX = px - projX;
  const diffZ = pz - projZ;

  let normX = -dirZ;
  let normZ = dirX;

  // Face normal outward towards the interaction pointer
  if (normX * diffX + normZ * diffZ < 0) {
    normX = -normX;
    normZ = -normZ;
  }

  const offsetBase = (nearestWall.thickness || 10) / 200; // half wall thickness (m)
  const halfDepth = (item.depth || 100) / 200; // half furniture depth (m)
  
  const extraOffset = 0.02; 
  // Windows and Doors are centered (offset 0). 
  // TVs are recessed: flush with the surface but poking INTO the wall.
  // Other furniture is snapped AGAINST the wall surface.
  let offset = offsetBase + halfDepth + extraOffset;
  if (isWindowOrDoor || item.id === 'tv') {
    offset = 0;
  }
  
  const finalX = projX + normX * offset;
  const finalZ = projZ + normZ * offset;

  // 6. Rotation & Elevation
  const finalRotation = Math.atan2(normX, normZ);
  let elevation = instance.elevation;
  if (item.type === 'DOOR') {
    elevation = 0;
  } else if (elevation === undefined) {
    elevation = item.elevation || 0;
  }

  return {
    ...instance,
    x: finalX,
    z: finalZ,
    rotation: finalRotation,
    snappedWallId: nearestWall.id,
    elevation,
    isSnapped: true
  };
};

// --- Utility to find nearest point on line segment ---
export const getNearestPointOnSegment = (p, a, b) => {
  const ap = [p[0] - a[0], p[2] - a[2]];
  const ab = [b[0] - a[0], b[2] - a[2]];
  const ab2 = ab[0] * ab[0] + ab[1] * ab[1];
  if (ab2 === 0) return [a[0], 0, a[2]];
  const ap_ab = ap[0] * ab[0] + ap[1] * ab[1];
  let t = ap_ab / ab2;
  if (t < 0) t = 0;
  if (t > 1) t = 1;
  return [a[0] + ab[0] * t, 0, a[2] + ab[1] * t];
};

export const PlannerProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState(null); // 'WALL', 'ROOM', 'CUSTOM_SHAPE', 'FLOOR', 'CHANGE_HEIGHT'
  const [viewMode, setViewMode] = useState('2D'); // '2D' or '3D'
  const [wallHeight, setWallHeight] = useState(260); // cm
  const [wallThickness, setWallThickness] = useState(10); // cm
  const [projectName, setProjectName] = useState("My project");
  
  const [walls, setWalls] = useState([]);
  const [floors, setFloors] = useState([]);
  const [wallDecals, setWallDecals] = useState([]);

  
  const [previewWall, setPreviewWall] = useState(null);
  const [previewRoom, setPreviewRoom] = useState(null); // { start: [x,0,z], end: [x,0,z] }
  const [previewFloorPoints, setPreviewFloorPoints] = useState([]); // array of [x,0,z]
  
  const [selectedWallId, setSelectedWallId] = useState(null);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState(null);
  const [hoveredWallId, setHoveredWallId] = useState(null);
  
  const [furniture, setFurniture] = useState([]); // { id, itemId, x, z, rotation, width, depth, color }

  const [placingFurniture, setPlacingFurniture] = useState(null);
  
  // --- View Controls State ---
  const [isDraggingScene, setIsDraggingScene] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [unit, setUnit] = useState('cm');

  // --- History Logic ---
  const history = useRef([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Initialize history on first mount or when state is first populated
  useEffect(() => {
    if (history.current.length === 0) {
      const initialState = { walls: [], floors: [], furniture: [], wallDecals: [], wallHeight: 260, wallThickness: 10, projectName: "My project" };
      history.current = [JSON.parse(JSON.stringify(initialState))];
      setHistoryIdx(0);
    }
  }, []);

  const saveToHistory = useCallback((customState = null) => {
    const stateToSave = customState || { walls, floors, furniture, wallDecals, wallHeight, wallThickness, projectName };

    
    // Don't save if identical to current history head
    if (historyIdx >= 0 && JSON.stringify(history.current[historyIdx]) === JSON.stringify(stateToSave)) return;

    const newHistory = history.current.slice(0, historyIdx + 1);
    newHistory.push(JSON.parse(JSON.stringify(stateToSave)));
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    
    history.current = newHistory;
    setHistoryIdx(newHistory.length - 1);
  }, [walls, floors, furniture, wallHeight, wallThickness, projectName, historyIdx]);

  // Special version of set state functions that save to history AFTER the update
  const addWall = useCallback((wall) => {
    // Prevent duplicate walls at the exact same position
    const isDuplicate = walls.some(w => 
      (Math.abs(w.start[0] - wall.start[0]) < 0.01 && Math.abs(w.start[2] - wall.start[2]) < 0.01 &&
       Math.abs(w.end[0] - wall.end[0]) < 0.01 && Math.abs(w.end[2] - wall.end[2]) < 0.01) ||
      (Math.abs(w.start[0] - wall.end[0]) < 0.01 && Math.abs(w.start[2] - wall.end[2]) < 0.01 &&
       Math.abs(w.end[0] - wall.start[0]) < 0.01 && Math.abs(w.end[2] - wall.start[2]) < 0.01)
    );
    if (isDuplicate) return;

    const newWall = { ...wall, id: `wall_${Date.now()}_${Math.random()}`, height: wallHeight, thickness: wallThickness };
    const newWalls = [...walls, newWall];
    setWalls(newWalls);
    saveToHistory({ walls: newWalls, floors, furniture, wallDecals, wallHeight, wallThickness, projectName });
    setPreviewWall(null);
  }, [walls, floors, furniture, wallHeight, wallThickness, projectName, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      const prevState = history.current[newIdx];
      setWalls(prevState.walls);
      setFloors(prevState.floors);
      setFurniture(prevState.furniture);
      setWallDecals(prevState.wallDecals || []);
      setWallHeight(prevState.wallHeight);
      setWallThickness(prevState.wallThickness);
      setProjectName(prevState.projectName);
    }
  }, [historyIdx]);

  const redo = useCallback(() => {
    if (historyIdx < history.current.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      const nextState = history.current[newIdx];
      setWalls(nextState.walls);
      setFloors(nextState.floors);
      setFurniture(nextState.furniture);
      setWallDecals(nextState.wallDecals || []);
      setWallHeight(nextState.wallHeight);
      setWallThickness(nextState.wallThickness);
      setProjectName(nextState.projectName);
    }
  }, [historyIdx]);

  const actions = {
    setViewMode,
    setProjectName,
    setTool: (tool) => {
      setActiveTool(tool);
      setPlacingFurniture(null);
      setPreviewWall(null);
      setPreviewRoom(null);
      setPreviewFloorPoints([]);
      setSelectedWallId(null);
      setSelectedFurnitureId(null);
    },
    setWallHeight: (height) => {
      saveToHistory();
      setWallHeight(height);
      if (activeTool === 'CHANGE_HEIGHT' && selectedWallId) {
        setWalls(walls.map(w => w.id === selectedWallId ? { ...w, height } : w));
      }
    },
    setWallThickness: (val) => {
        saveToHistory();
        setWallThickness(val);
    },
    
    // Wall Actions
    addWall,
    addWalls: (newWalls) => {
      const added = [];
      newWalls.forEach(wall => {
        const isDuplicate = walls.some(w => 
          (Math.abs(w.start[0] - wall.start[0]) < 0.01 && Math.abs(w.start[2] - wall.start[2]) < 0.01 &&
           Math.abs(w.end[0] - wall.end[0]) < 0.01 && Math.abs(w.end[2] - wall.end[2]) < 0.01) ||
          (Math.abs(w.start[0] - wall.end[0]) < 0.01 && Math.abs(w.start[2] - wall.end[2]) < 0.01 &&
           Math.abs(w.end[0] - wall.start[0]) < 0.01 && Math.abs(w.end[2] - wall.start[2]) < 0.01)
        );
        if (!isDuplicate) {
          added.push({ ...wall, id: `wall_${Date.now()}_${Math.random()}`, height: wallHeight, thickness: wallThickness });
        }
      });
      
      if (added.length === 0) return;
      const updatedWalls = [...walls, ...added];
      setWalls(updatedWalls);
      saveToHistory({ walls: updatedWalls, floors, furniture, wallDecals, wallHeight, wallThickness, projectName });
      setPreviewRoom(null);
    },
    updatePreviewWall: (wall) => setPreviewWall(wall),
    clearPreviewWall: () => setPreviewWall(null),
    
    // Room Actions
    updatePreviewRoom: (roomInfo) => setPreviewRoom(roomInfo),
    clearPreviewRoom: () => setPreviewRoom(null),

    // Floor Actions
    addFloorPoint: (point) => setPreviewFloorPoints(prev => [...prev, point]),
    updateFloorPreviewPoint: (point) => {
      if (previewFloorPoints.length > 0) {
        const newPoints = [...previewFloorPoints];
        newPoints[newPoints.length - 1] = point; // last point is the hovering preview point
        setPreviewFloorPoints(newPoints);
      }
    },
    finishFloor: (points) => {
      saveToHistory();
      if (points.length >= 3) {
        setFloors(prev => [...prev, { id: `floor_${Date.now()}`, points }]);
      }
      setPreviewFloorPoints([]);
    },
    cancelFloor: () => setPreviewFloorPoints([]),

    // Selection Action
    selectWall: (id) => {
        setSelectedWallId(id);
        setSelectedFurnitureId(null);
    },
    selectFurniture: (id) => {
        setSelectedFurnitureId(id);
        setSelectedWallId(null);
    },
    
    // Furniture Actions
    startPlacingFurniture: (item) => {
      setPlacingFurniture(item);
      setActiveTool(null);
    },
    cancelPlacingFurniture: () => setPlacingFurniture(null),
    addFurniture: (instance) => {
      const item = instance.item;
      if (!item) return;

      const snapped = getSnappedFurniture(instance, walls);
      
      // Validation: Windows and Doors MUST be snapped to a wall
      if ((item.type === 'WINDOW' || item.type === 'DOOR') && !snapped.isSnapped) {
        setPlacingFurniture(null);
        return;
      }

      saveToHistory();
      const newFurniture = {
        ...snapped,
        id: `furn_${Date.now()}_${Math.random()}`,
        width: snapped.width || item.width || 100,
        depth: snapped.depth || item.depth || 100,
        height: snapped.height || item.height || 80,
        elevation: snapped.elevation !== undefined ? snapped.elevation : (item.elevation || 0),
        decoration: snapped.decoration || null
      };
      
      setFurniture(prev => [...prev, newFurniture]);
      setPlacingFurniture(null);
    },
    removeFurniture: (id) => {
      saveToHistory();
      setFurniture(prev => prev.filter(f => f.id !== id));
      if (selectedFurnitureId === id) setSelectedFurnitureId(null);
    },
    updateFurniture: (id, updates, shouldSave = true) => {
      if (shouldSave) saveToHistory();
      setFurniture(prev => prev.map(f => {
        if (f.id === id) {
          const updated = { ...f, ...updates };
          return getSnappedFurniture(updated, walls, f);
        }
        return f;
      }));
    },
    
    // Decoration Actions
    applyDecoration: (id, decoration) => {
      saveToHistory();
      setWalls(prev => prev.map(w => w.id === id ? { ...w, decoration } : w));
      setFloors(prev => prev.map(f => f.id === id ? { ...f, decoration } : f));
      setFurniture(prev => prev.map(f => f.id === id ? { ...f, decoration } : f));
    },
    updateDecoration: (id, updates) => {
      saveToHistory();
      setWalls(prev => prev.map(w => w.id === id ? { ...w, decoration: { ...w.decoration, ...updates } } : w));
      setFloors(prev => prev.map(f => f.id === id ? { ...f, decoration: { ...f.decoration, ...updates } } : f));
      setFurniture(prev => prev.map(f => f.id === id ? { ...f, decoration: { ...f.decoration, ...updates } } : f));
    },


    addWallDecal: (decal) => {
      saveToHistory();
      const newDecal = {
        ...decal,
        id: `decal_${Date.now()}_${Math.random()}`
      };
      setWallDecals(prev => [...prev, newDecal]);
    },
    removeWallDecal: (id) => {
      saveToHistory();
      setWallDecals(prev => prev.filter(d => d.id !== id));
    },

    setHoveredWallId,
    
    // View Controls Actions
    setIsDraggingScene,
    setZoomLevel: (level) => setZoomLevel(Math.max(10, Math.min(500, level))),
    setUnit: (u) => setUnit(u),
    resetView: () => {
      setZoomLevel(100);
      setIsDraggingScene(false);
      // We might need to dispatch an event for the canvas to reset camera
      window.dispatchEvent(new CustomEvent('planner-reset-view'));
    },
    
    // Global Actions

    deleteSelected: () => {
      if (selectedFurnitureId) {
        actions.removeFurniture(selectedFurnitureId);
      } else if (selectedWallId) {
        saveToHistory();
        setWalls(prev => prev.filter(w => w.id !== selectedWallId));
        setSelectedWallId(null);
      }
    },

    clearCanvas: () => {
        if (window.confirm("Are you sure you want to clear the entire canvas?")) {
            saveToHistory();
            setWalls([]);
            setFloors([]);
            setFurniture([]);
            setActiveTool(null);
            setSelectedWallId(null);
            setSelectedFurnitureId(null);
        }
    },
    undo,
    redo,
    saveToHistory
  };

  const state = {
    activeTool,
    viewMode,
    wallHeight,
    wallThickness,
    projectName,
    walls,
    floors,
    previewWall,
    previewRoom,
    previewFloorPoints,
    selectedWallId,
    selectedFurnitureId,
    hoveredWallId,
    furniture,
    isDraggingScene,
    zoomLevel,
    unit,

    wallDecals,
    placingFurniture,
    canUndo: historyIdx > 0,
    canRedo: historyIdx < history.current.length - 1
  };

  return (
    <PlannerContext.Provider value={{ state, actions }}>
      {children}
    </PlannerContext.Provider>
  );
};
