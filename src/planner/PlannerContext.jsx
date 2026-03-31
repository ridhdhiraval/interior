import React, { createContext, useContext, useState } from 'react';

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

export const PlannerProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState(null); // 'WALL', 'ROOM', 'CUSTOM_SHAPE', 'FLOOR', 'CHANGE_HEIGHT'
  const [wallHeight, setWallHeight] = useState(280); // cm
  const [wallThickness, setWallThickness] = useState(10); // cm
  
  const [walls, setWalls] = useState([]);
  const [floors, setFloors] = useState([]);
  
  const [previewWall, setPreviewWall] = useState(null);
  const [previewRoom, setPreviewRoom] = useState(null); // { start: [x,0,z], end: [x,0,z] }
  const [previewFloorPoints, setPreviewFloorPoints] = useState([]); // array of [x,0,z]
  
  const [selectedWallId, setSelectedWallId] = useState(null);
  
  // Furniture State
  const [furniture, setFurniture] = useState([]); // { id, itemId, x, z, rotation, width, depth, color }
  const [placingFurniture, setPlacingFurniture] = useState(null);

  const actions = {
    setTool: (tool) => {
      setActiveTool(tool);
      setPlacingFurniture(null);
      setPreviewWall(null);
      setPreviewRoom(null);
      setPreviewFloorPoints([]);
      setSelectedWallId(null);
    },
    setWallHeight: (height) => {
      setWallHeight(height);
      if (activeTool === 'CHANGE_HEIGHT' && selectedWallId) {
        setWalls(walls.map(w => w.id === selectedWallId ? { ...w, height } : w));
      }
    },
    setWallThickness,
    
    // Wall Actions
    addWall: (wall) => {
      const newWall = { ...wall, id: `wall_${Date.now()}_${Math.random()}`, height: wallHeight, thickness: wallThickness };
      setWalls(prev => [...prev, newWall]);
      setPreviewWall(null);
    },
    addWalls: (newWalls) => {
      const added = newWalls.map(w => ({ ...w, id: `wall_${Date.now()}_${Math.random()}`, height: wallHeight, thickness: wallThickness }));
      setWalls(prev => [...prev, ...added]);
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
      if (points.length >= 3) {
        setFloors(prev => [...prev, { id: `floor_${Date.now()}`, points }]);
      }
      setPreviewFloorPoints([]);
    },
    cancelFloor: () => setPreviewFloorPoints([]),

    // Selection Action
    selectWall: (id) => setSelectedWallId(id),
    
    // Furniture Actions
    startPlacingFurniture: (item) => {
      setPlacingFurniture(item);
      setActiveTool(null);
    },
    cancelPlacingFurniture: () => setPlacingFurniture(null),
    addFurniture: (instance) => {
      setFurniture(prev => [...prev, { ...instance, id: Date.now() }]);
    },
    removeFurniture: (id) => {
      setFurniture(prev => prev.filter(f => f.id !== id));
    }
  };

  const state = {
    activeTool,
    wallHeight,
    wallThickness,
    walls,
    floors,
    previewWall,
    previewRoom,
    previewFloorPoints,
    selectedWallId,
    furniture,
    placingFurniture
  };

  return (
    <PlannerContext.Provider value={{ state, actions }}>
      {children}
    </PlannerContext.Provider>
  );
};
