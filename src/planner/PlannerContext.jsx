import React, { createContext, useContext, useState } from 'react';

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

export const PlannerProvider = ({ children }) => {
  const [activeTool, setActiveTool] = useState(null); // 'WALL', 'ROOM', etc.
  const [wallHeight, setWallHeight] = useState(300); // cm
  const [walls, setWalls] = useState([]);
  const [previewWall, setPreviewWall] = useState(null);
  
  // Furniture State
  const [furniture, setFurniture] = useState([]); // { id, itemId, x, z, rotation, width, depth, color }
  const [placingFurniture, setPlacingFurniture] = useState(null); // Item being placed (template)

  const actions = {
    setTool: (tool) => {
      setActiveTool(tool);
      setPlacingFurniture(null); // Cancel furniture placement if tool changes
    },
    setWallHeight,
    addWall: (wall) => {
      setWalls([...walls, { ...wall, height: wallHeight }]);
      setPreviewWall(null);
    },
    updatePreview: (wall) => setPreviewWall(wall),
    clearPreview: () => setPreviewWall(null),
    
    // Furniture Actions
    startPlacingFurniture: (item) => {
      setPlacingFurniture(item);
      setActiveTool(null); // Cancel other tools
    },
    cancelPlacingFurniture: () => setPlacingFurniture(null),
    addFurniture: (instance) => {
      setFurniture([...furniture, { ...instance, id: Date.now() }]);
      // We keep placingFurniture set so user can place multiple copies
    },
    removeFurniture: (id) => {
      setFurniture(furniture.filter(f => f.id !== id));
    }
  };

  const state = {
    activeTool,
    wallHeight,
    walls,
    previewWall,
    furniture,
    placingFurniture
  };

  return (
    <PlannerContext.Provider value={{ state, actions }}>
      {children}
    </PlannerContext.Provider>
  );
};
