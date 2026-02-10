import React, { useState } from "react";
import PlannerCanvas from "./PlannerCanvas";
import { usePlanner } from "../planner/PlannerContext";
import { furnitureCategories, furnitureItems } from "../planner/furnitureData";

export default function ManualDesign() {
  const { state, actions } = usePlanner();
  const [activeTab, setActiveTab] = useState('CONSTRUCTION'); // CONSTRUCTION, FURNITURE, DECOR, HUMAN, SEARCH
  const [furnitureCategory, setFurnitureCategory] = useState(null); // If null, show categories. Else show items.

  const handleToolClick = (tool) => {
    actions.setTool(tool === state.activeTool ? null : tool);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFurnitureCategory(null); // Reset furniture view
    actions.setTool(null); // Reset tool
  };

  const handleFurnitureCategoryClick = (catId) => {
    setFurnitureCategory(catId);
  };

  const handleFurnitureBack = () => {
    setFurnitureCategory(null);
  };

  // --- Render Sub-Panels ---

  const renderConstructionPanel = () => (
    <>
      <div className="height-control">
        <span>Walls height</span>
        <div className="height-input-wrapper">
          <input 
            type="number" 
            value={state.wallHeight} 
            onChange={(e) => actions.setWallHeight(Number(e.target.value))}
          />
          <span className="unit">cm</span>
        </div>
      </div>

      <div className={`tool-item ${state.activeTool === 'WALL' ? 'active' : ''}`} onClick={() => handleToolClick('WALL')}>
        <span className="tool-icon">🧱</span>
        <div className="tool-text">
          <span className="title">Wall</span>
          <span className="subtitle">Draw walls</span>
        </div>
        <span className="edit-icon">✏️</span>
      </div>

      <div className={`tool-item ${state.activeTool === 'ROOM' ? 'active' : ''}`} onClick={() => handleToolClick('ROOM')}>
        <span className="tool-icon">⬜</span>
        <div className="tool-text">
          <span className="title">Room</span>
          <span className="subtitle">Add square room</span>
        </div>
        <span className="edit-icon">✏️</span>
      </div>

      <div className="tool-item">
        <span className="tool-icon">⬢</span>
        <div className="tool-text">
          <span className="title">Custom shape</span>
          <span className="subtitle">Draw complex room</span>
        </div>
        <span className="edit-icon">✏️</span>
      </div>

      <div className="tool-item">
        <span className="tool-icon">✂️</span>
        <div className="tool-text">
          <span className="title">Wall cutout</span>
          <span className="subtitle">Doors, windows</span>
        </div>
        <span className="edit-icon">✏️</span>
      </div>

      <div className="tool-item">
        <span className="tool-icon">⬛</span>
        <div className="tool-text">
          <span className="title">Floor</span>
          <span className="subtitle">Add floor shape</span>
        </div>
        <span className="edit-icon">✏️</span>
      </div>
      
      <div className="tool-item">
        <span className="tool-icon">📏</span>
        <div className="tool-text">
          <span className="title">Change height</span>
          <span className="subtitle">Adjust wall height</span>
        </div>
      </div>

      <div className="tool-item">
        <span className="tool-icon">📤</span>
        <div className="tool-text">
          <span className="title">Upload plan</span>
          <span className="subtitle">Trace from image</span>
        </div>
      </div>
    </>
  );

  const renderFurniturePanel = (typeFilter = 'FURNITURE') => {
    if (furnitureCategory) {
      // Show Items
      const items = furnitureItems[furnitureCategory] || [];
      const catName = furnitureCategories.find(c => c.id === furnitureCategory)?.name;

      return (
        <div className="furniture-list">
          <div className="panel-header">
            <button className="back-btn" onClick={handleFurnitureBack}>←</button>
            <h3>{catName}</h3>
          </div>
          <div className="items-grid">
            {items.map(item => (
              <div 
                key={item.id} 
                className={`furniture-item ${state.placingFurniture?.id === item.id ? 'active' : ''}`}
                onClick={() => actions.startPlacingFurniture(item)}
              >
                <div className="item-thumb">
                  <img src={item.image} alt={item.name} />
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Show Categories
    const categoriesToShow = furnitureCategories.filter(c => (c.type || 'FURNITURE') === typeFilter);

    return (
      <div className="furniture-categories">
        <h3>{typeFilter === 'FURNITURE' ? 'Furniture' : 'Decoration'}</h3>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder={`Search ${typeFilter === 'FURNITURE' ? 'furniture' : 'decoration'}...`} />
        </div>
        <div className="categories-list">
          {categoriesToShow.map(cat => (
            <div key={cat.id} className="category-item" onClick={() => handleFurnitureCategoryClick(cat.id)}>
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="arrow">›</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="rd-root">
        {/* LEFT ICON BAR */}
        <aside className="rd-iconbar">
          <div 
            className={`icon ${activeTab === 'CONSTRUCTION' ? 'active' : ''}`} 
            onClick={() => handleTabClick('CONSTRUCTION')}
            title="Construction"
          >
            🧱
          </div>
          <div 
            className={`icon ${activeTab === 'FURNITURE' ? 'active' : ''}`} 
            onClick={() => handleTabClick('FURNITURE')}
            title="Furniture"
          >
            🪑
          </div>
          <div 
            className={`icon ${activeTab === 'DECOR' ? 'active' : ''}`} 
            onClick={() => handleTabClick('DECOR')}
            title="Decoration"
          >
            🎨
          </div>
          <div 
            className={`icon ${activeTab === 'HUMAN' ? 'active' : ''}`} 
            onClick={() => handleTabClick('HUMAN')}
            title="First Person View"
          >
            👤
          </div>
          <div className="icon spacer"></div>
          <div className="icon search" title="Search">
            🔍
          </div>
          <div className="icon help" title="Help">
            ❓
          </div>
        </aside>

        {/* LEFT TOOL PANEL */}
        <section className="rd-tools">
          {activeTab === 'CONSTRUCTION' && renderConstructionPanel()}
          {activeTab === 'FURNITURE' && renderFurniturePanel('FURNITURE')}
          {activeTab === 'DECOR' && renderFurniturePanel('DECOR')}
          {activeTab === 'HUMAN' && <div className="placeholder-panel">First Person View <br/>(Coming Soon)</div>}
        </section>

        {/* MAIN CANVAS */}
        <main className="rd-canvas">
          <div className="topbar">
            <button className="upgrade">Upgrade</button>
            <div className="divider"></div>
            <span className="lang">EN</span>
            <span className="project">My project</span>
            <div className="actions">
              <button title="Snapshot">📷</button>
              <button title="Save">💾</button>
              <button title="Undo">↩️</button>
            </div>
          </div>

          <div className="workspace">
            <PlannerCanvas />
            
            {state.activeTool === 'WALL' && (
              <div className="instruction-overlay">
                Click to start drawing a wall. Right-click to stop.
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        * { box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { margin: 0; overflow: hidden; }

        .rd-root {
          display: flex;
          height: calc(100vh - 70px);
          margin-top: 70px;
          background: #f2f2f2;
        }

        /* --- ICON BAR (Dark Left) --- */
        .rd-iconbar {
          width: 50px;
          background: #2c2c2c;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 0;
          z-index: 20;
        }

        .icon {
          width: 50px;
          height: 50px;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .icon:hover {
          color: #fff;
          background: #3a3a3a;
        }

        .icon.active {
          color: #fff;
          background: #3a3a3a;
          border-left: 3px solid #8cc63f; /* Green highlight line */
        }

        .icon.spacer { flex: 1; pointer-events: none; }
        .icon.search { border-top: 1px solid #444; }

        /* --- TOOL PANEL (White) --- */
        .rd-tools {
          width: 280px;
          background: #fff;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          z-index: 10;
          overflow-y: auto;
        }

        /* Construction Panel Styles */
        .height-control {
          padding: 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #333;
        }

        .height-input-wrapper {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 4px;
          padding: 0 5px;
        }

        .height-input-wrapper input {
          width: 50px;
          border: none;
          background: transparent;
          text-align: right;
          padding: 5px;
          font-weight: bold;
          outline: none;
        }

        .height-input-wrapper .unit {
          font-size: 12px;
          color: #888;
          margin-left: 2px;
        }

        .tool-item {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          cursor: pointer;
          border-bottom: 1px solid #f5f5f5;
          transition: background 0.2s;
        }

        .tool-item:hover { background: #f9f9f9; }
        .tool-item.active { background: #e6f7ff; }

        .tool-icon {
          font-size: 24px;
          width: 40px;
          color: #666;
        }

        .tool-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .tool-text .title { font-size: 14px; color: #333; font-weight: 500; }
        .tool-text .subtitle { font-size: 11px; color: #888; margin-top: 2px; }

        .edit-icon { font-size: 12px; opacity: 0; color: #999; }
        .tool-item:hover .edit-icon { opacity: 1; }

        /* Furniture Panel Styles */
        .furniture-categories { padding: 15px; }
        .furniture-categories h3, .furniture-list h3 { margin: 0 0 15px 0; font-size: 16px; color: #333; }
        
        .search-box {
          display: flex;
          align-items: center;
          background: #f0f0f0;
          padding: 8px 12px;
          border-radius: 20px;
          margin-bottom: 20px;
        }

        .search-box input {
          border: none;
          background: transparent;
          margin-left: 8px;
          width: 100%;
          outline: none;
          font-size: 13px;
        }

        .category-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }

        .category-item:hover { color: #8cc63f; }
        .cat-icon { width: 30px; font-size: 18px; }
        .cat-name { flex: 1; font-size: 14px; }
        .arrow { color: #ccc; }

        .panel-header {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
          gap: 10px;
        }

        .back-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #666;
          padding: 0;
        }

        .items-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 15px;
        }

        .furniture-item {
          background: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .furniture-item:hover {
          border-color: #8cc63f;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .item-thumb {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .item-thumb img {
          max-width: 100%;
          max-height: 100%;
          opacity: 0.8;
        }

        .furniture-item span {
          display: block;
          font-size: 12px;
          color: #555;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .placeholder-panel {
          padding: 40px;
          text-align: center;
          color: #999;
          font-style: italic;
        }

        /* --- CANVAS AREA --- */
        .rd-canvas {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .topbar {
          height: 40px;
          background: #fff;
          border-bottom: 1px solid #ddd;
          display: flex;
          align-items: center;
          padding: 0 15px;
          font-size: 13px;
          color: #666;
        }

        .upgrade {
          background: #ffcc00;
          border: none;
          padding: 4px 12px;
          border-radius: 3px;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          color: #333;
        }

        .divider { width: 1px; height: 20px; background: #eee; margin: 0 15px; }
        .lang { margin-right: 15px; font-weight: 500; color: #333; cursor: pointer; }
        .project { flex: 1; color: #333; font-weight: 500; }

        .actions { display: flex; gap: 5px; }
        .actions button {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .actions button:hover { background: #f0f0f0; }

        .workspace {
          flex: 1;
          background: #fff; /* White blueprint background */
          position: relative;
          overflow: hidden;
        }

        .instruction-overlay {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(44, 44, 44, 0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          pointer-events: none;
          z-index: 100;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
}
