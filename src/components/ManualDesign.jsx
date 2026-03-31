import React, { useState } from "react";
import PlannerCanvas from "./PlannerCanvas";
import { usePlanner } from "../planner/PlannerContext";
import { 
  furnitureCategories, 
  furnitureItems,
  catalogCategories,
  catalogSubCategories,
  catalogItems
} from "../planner/furnitureData";

export default function ManualDesign() {
  const { state, actions } = usePlanner();
  const [activeTab, setActiveTab] = useState('CONSTRUCTION'); // CONSTRUCTION, FURNITURE, DECOR, HUMAN, SEARCH
  // Array representing hierarchical path of catalogs (e.g. ['living', 'upholstered'])
  const [catalogPath, setCatalogPath] = useState([]); 

  const handleToolClick = (tool) => {
    actions.setTool(tool === state.activeTool ? null : tool);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCatalogPath([]);
    actions.setTool(null);
  };

  const handleCatalogItemClick = (id) => {
    setCatalogPath([...catalogPath, id]);
  };

  const handleFurnitureBack = () => {
    setCatalogPath(catalogPath.slice(0, -1));
  };

  // --- Render Sub-Panels ---

  const renderConstructionPanel = () => (
    <>
      <div className="height-control">
        <span>Walls height {state.wallHeight}</span>
        <div className="height-input-controls">
          <button onClick={() => actions.setWallHeight(state.wallHeight + 1)}>▲</button>
          <button onClick={() => actions.setWallHeight(state.wallHeight - 1)}>▼</button>
        </div>
      </div>

      <div className={`tool-item ${state.activeTool === 'WALL' ? 'active' : ''}`} onClick={() => handleToolClick('WALL')}>
        <div className="tool-icon-img">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#a3a3a3"><path d="M4 4h16v4H4zM4 10h8v4H4zM14 10h6v4h-6zM4 16h16v4H4z" /></svg>
        </div>
        <div className="tool-text">
          <span className="title">Wall</span>
        </div>
      </div>

      <div className={`tool-item ${state.activeTool === 'ROOM' ? 'active' : ''}`} onClick={() => handleToolClick('ROOM')}>
        <div className="tool-icon-img">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="3"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
        </div>
        <div className="tool-text">
          <span className="title">Room</span>
        </div>
      </div>

      <div className={`tool-item ${state.activeTool === 'CUSTOM_SHAPE' ? 'active' : ''}`} onClick={() => handleToolClick('CUSTOM_SHAPE')}>
        <div className="tool-icon-img">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" fill="#a3a3a3" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
        </div>
        <div className="tool-text">
          <span className="title">Custom shape wall</span>
        </div>
      </div>

      <div className={`tool-item ${state.activeTool === 'FLOOR' ? 'active' : ''}`} onClick={() => handleToolClick('FLOOR')}>
        <div className="tool-icon-img">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2"><polygon points="12 2 2 12 12 22 22 12 12 2" fill="#e5e5e5" /></svg>
        </div>
        <div className="tool-text">
          <span className="title">Floor</span>
        </div>
      </div>

      <div className={`tool-item ${state.activeTool === 'CHANGE_HEIGHT' ? 'active' : ''}`} onClick={() => handleToolClick('CHANGE_HEIGHT')}>
        <div className="tool-icon-img">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#a3a3a3"><rect x="4" y="8" width="8" height="8" /><path d="M18 4v16M15 7l3-3 3 3M15 17l3 3 3-3" /></svg>
        </div>
        <div className="tool-text">
          <span className="title">Change wall's height</span>
        </div>
      </div>

      <div className="thickness-control">
        <span>Wall Thickness: {state.wallThickness}</span>
        <input
          type="range"
          min="1"
          max="50"
          value={state.wallThickness}
          onChange={(e) => actions.setWallThickness(Number(e.target.value))}
          className="thickness-slider"
        />
      </div>
    </>
  );

  const renderFurniturePanel = (typeFilter = 'FURNITURE') => {
    const currentCatId = catalogPath.length > 0 ? catalogPath[catalogPath.length - 1] : null;

    // 1. Is it a final item grid?
    if (currentCatId && catalogItems[currentCatId]) {
      const items = catalogItems[currentCatId] || [];
      // Find title from anywhere
      let subName = currentCatId;
      if (catalogPath.length >= 2) {
         const parentCatId = catalogPath[catalogPath.length - 2];
         subName = catalogSubCategories[parentCatId]?.find(c => c.id === currentCatId)?.name || subName;
      }

      return (
        <div className="search-pane">
          <div className="search-box">
            <input type="text" placeholder="Search furniture..." />
          </div>
          <div className="furniture-list">
            <div className="panel-header" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ cursor: 'pointer', marginRight: '10px' }} onClick={handleFurnitureBack}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </span>
              <h3 style={{ margin: 0, fontSize: '14px', color: '#333' }}>{subName}</h3>
            </div>
            <div className="items-grid">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`furniture-item ${state.placingFurniture?.id === item.id ? 'active' : ''}`}
                  onClick={() => !item.isPremium && actions.startPlacingFurniture(item)}
                  style={item.isPremium ? { opacity: 0.6 } : {}}
                >
                  {item.isPremium && <div className="premium-lock">PRO</div>}
                  <div className="item-thumb">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 2. Is it a sub-category list?
    if (currentCatId && catalogSubCategories[currentCatId]) {
      const subCats = catalogSubCategories[currentCatId] || [];
      const parentName = catalogCategories.find(c => c.id === currentCatId)?.name || 
                         (catalogPath.length >= 2 ? catalogSubCategories[catalogPath[catalogPath.length - 2]]?.find(c => c.id === currentCatId)?.name : currentCatId);
      
      return (
        <div className="products-catalog">
          <div className="panel-header-top">
            <span className="catalog-icon" style={{ cursor: 'pointer', marginRight: '6px' }} onClick={handleFurnitureBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </span>
            <span className="catalog-title">{parentName}</span>
            <span className="catalog-settings">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
            </span>
          </div>
          <div className="catalog-list">
            {subCats.map(sub => (
              <div key={sub.id} className="catalog-item" onClick={() => handleCatalogItemClick(sub.id)}>
                <span className="cat-text">{sub.name}</span>
                <img src={sub.image} alt={sub.name} className="cat-hero-img" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    const categoriesToShow = furnitureCategories.filter(c => (c.type || 'FURNITURE') === typeFilter);

    // Level 1: Main Catalog Panel
    if (typeFilter === 'FURNITURE') {
      return (
        <div className="products-catalog">
          <div className="panel-header-top">
            <span className="catalog-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
            </span>
            <span className="catalog-title">Products catalog</span>
            <span className="catalog-settings">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
            </span>
          </div>
          <div className="catalog-list">
            {catalogCategories.map(cat => (
              <div key={cat.id} className="catalog-item" onClick={() => handleCatalogItemClick(cat.id)}>
                <span className="cat-text">{cat.name}</span>
                <img src={cat.image} alt={cat.name} className="cat-hero-img" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Decor/materials layout
    return (
      <div className="materials-pane">
        <div className="material-section">
          <h4>Floors</h4>
          <div className="color-grid">
            <div className="color-box" style={{ background: '#ffffff', border: '1px solid #ddd' }}></div>
            <div className="color-box" style={{ background: '#f2f2f2' }}></div>
            <div className="color-box" style={{ background: '#e0e0e0' }}></div>
            <div className="color-box" style={{ background: '#d4e6f1' }}></div>
            <div className="color-box" style={{ background: '#f5b041' }}></div>
            <div className="color-box" style={{ background: '#fcf3cf' }}></div>
            <div className="color-box" style={{ background: '#d5f5e3' }}></div>
            <div className="color-box" style={{ background: '#aed6f1' }}></div>
            <div className="color-box" style={{ background: '#f5cba7' }}></div>
            <div className="color-box" style={{ background: '#f1948a' }}></div>
          </div>
        </div>
        <div className="material-section">
          <div className="section-head">
            <div className="icon-box">🧱</div>
            <h4>Walls</h4>
          </div>
          <div className="color-grid">
            <div className="color-box" style={{ background: '#333' }}></div>
            <div className="color-box" style={{ background: '#555' }}></div>
            <div className="color-box" style={{ background: '#777' }}></div>
            <div className="color-box" style={{ background: '#999' }}></div>
            <div className="color-box" style={{ background: '#ccc' }}></div>
            <div className="color-box" style={{ background: '#8cc63f' }}></div>
            <div className="color-box" style={{ background: '#2874a6' }}></div>
            <div className="color-box" style={{ background: '#b03a2e' }}></div>
            <div className="color-box" style={{ background: '#d35400' }}></div>
            <div className="color-box" style={{ background: '#196f3d' }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="rd-root">
        {/* LEFT ICON BAR */}
        <aside className="rd-iconbar">
          <div className="user-icon">👤</div>

          <div
            className={`action-icon ${activeTab === 'CONSTRUCTION' ? 'active' : ''}`}
            onClick={() => handleTabClick('CONSTRUCTION')}
            title="Construction"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </div>

          <div
            className={`action-icon ${activeTab === 'FURNITURE' ? 'active' : ''}`}
            onClick={() => handleTabClick('FURNITURE')}
            title="Furniture"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" /><path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M4 16h16" /></svg>
          </div>

          <div
            className={`action-icon ${activeTab === 'DECOR' ? 'active' : ''}`}
            onClick={() => handleTabClick('DECOR')}
            title="Decoration"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </div>

          <div
            className={`action-icon ${activeTab === 'HUMAN' ? 'active' : ''}`}
            onClick={() => handleTabClick('HUMAN')}
            title="3D View"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
          </div>

        </aside>

        {/* LEFT TOOL PANEL */}
        <section className="rd-tools">
          {activeTab === 'CONSTRUCTION' && renderConstructionPanel()}
          {activeTab === 'FURNITURE' && renderFurniturePanel('FURNITURE')}
          {activeTab === 'DECOR' && renderFurniturePanel('DECOR')}
          {activeTab === 'HUMAN' && <div className="placeholder-panel">3D View Options <br />(Coming Soon)</div>}
        </section>

        {/* MAIN CANVAS */}
        <main className="rd-canvas">
          <div className="topbar">
            <div className="app-title">ICONIC INTERIOR</div>
            <div className="middle-space"></div>
            <button className="upgrade">UPGRADE</button>
            <div className="lang">🌐 EN</div>
            <span className="project">My project</span>
            <div className="actions">
              <button title="Trash" className="header-action">🗑️</button>
              <button title="Copy" className="header-action">📄</button>
              <button title="Undo" className="header-action">↩️</button>
            </div>
          </div>

          <div className="workspace">
            <PlannerCanvas />

            {state.activeTool && <div className="instruction-overlay">
              {state.activeTool === 'WALL' && "Click to start drawing a wall segment. Click again to end."}
              {state.activeTool === 'ROOM' && "Click to place room corner, move and click to finish square."}
              {state.activeTool === 'CUSTOM_SHAPE' && "Click points to draw connected walls. Right-click to stop."}
              {state.activeTool === 'FLOOR' && "Click points to define a custom floor shape. Right-click to close and finish."}
              {state.activeTool === 'CHANGE_HEIGHT' && "Click on an existing wall to select it and update its height."}
            </div>}
          </div>

          <div className="bottom-bar">
            <div className="controls">
              <span className="control-label">Drag scene</span>
              <div className="toggle-switch"></div>
              <span>— 100% +</span>
              <span>⤢ cm</span>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { margin: 0; overflow: hidden; background: #222; }

        .rd-root {
          display: flex;
          height: calc(100vh - 60px); 
          margin-top: 60px; /* Assuming external header */
          background: #fff;
        }

        /* --- ICON BAR --- */
        .rd-iconbar {
          width: 50px;
          background: #333;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 15px;
          z-index: 20;
          gap: 15px;
        }

        .user-icon {
          width: 30px;
          height: 30px;
          background: #555;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .action-icon {
          width: 40px;
          height: 40px;
          color: #aaa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .action-icon:hover {
          color: #fff;
        }

        .action-icon.active {
          background: #8cc63f; /* Green highlight color */
          color: white;
          border-radius: 4px;
        }

        /* --- TOOL PANEL --- */
        .rd-tools {
          width: 250px;
          background: #fff;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          z-index: 10;
          overflow-y: auto;
        }

        /* Construction Panel Styles */
        .height-control {
          padding: 20px 15px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .height-input-controls {
          display: flex;
          flex-direction: column;
        }
        .height-input-controls button {
          background: none;
          border: none;
          font-size: 10px;
          cursor: pointer;
          color: #666;
          padding: 0;
          line-height: 1;
        }

        .tool-item {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .tool-item:hover { background: #fbfbfb; }
        .tool-item.active { background: #f8ffe8; color: #8cc63f; } /* light green */

        .tool-icon-img {
          width: 30px;
          height: 30px;
          background: #f5f5f5;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }

        .tool-text .title { font-size: 13px; font-weight: 500; color: #444; }
        .tool-item.active .tool-text .title { color: #8cc63f; }
        
        .thickness-control {
          padding: 20px;
          border-top: 1px solid #eee;
          font-size: 13px;
          color: #444;
          font-weight: 500;
        }
        
        .thickness-slider {
          width: 100%;
          margin-top: 10px;
          accent-color: #2874a6; /* Blue slider handle like screenshot */
        }

        /* Furniture & Decor Panel */
        .search-pane {
           display: flex;
           flex-direction: column;
        }
        .search-box {
           padding: 15px;
           border-bottom: 1px solid #eee;
        }
        .search-box input {
           width: 100%;
           border: 1px solid #ddd;
           border-radius: 4px;
           padding: 8px 10px;
           font-size: 12px;
           background: #fff;
           outline: none;
        }
        
        .products-catalog { display: flex; flex-direction: column; overflow-y: auto; }
        .panel-header-top { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee; font-weight: 600; font-size: 13px; color: #333; }
        .catalog-icon { margin-right: 10px; display: flex; align-items: center; }
        .catalog-title { flex: 1; }
        .catalog-settings { cursor: pointer; color: #888; display: flex; align-items: center; }
        
        .catalog-list { padding: 15px; display: flex; flex-direction: column; gap: 20px; }
        .catalog-item { cursor: pointer; display: flex; flex-direction: column; border-bottom: 1px solid #f9f9f9; padding-bottom: 20px; transition: opacity 0.2s; }
        .catalog-item:hover { opacity: 0.7; }
        .cat-text { font-size: 11px; font-weight: 600; color: #333; margin-bottom: 15px; }
        .cat-hero-img { width: 70%; max-height: 80px; object-fit: contain; margin: 0 auto; display: block; }
        /* Grid layout for items */
        .items-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 15px; overflow-y: auto;
        }
        .panel-header { padding: 15px; border-bottom: 1px solid #eee; }
        .furniture-item {
          display: flex; flex-direction: column; align-items: flex-start;
          cursor: pointer; position: relative; border: 1px solid transparent; padding: 5px;
        }
        .furniture-item:hover { border-color: #eee; border-radius: 4px; }
        .item-thumb {
          width: 100%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px; background: #fff;
        }
        .item-thumb img { max-width: 90%; max-height: 90%; object-fit: contain; }
        .furniture-item span { font-size: 11px; font-weight: 500; color: #333; line-height: 1.2; text-transform: capitalize; }
        .premium-lock {
          position: absolute; top: 0; right: 0; font-size: 8px; font-weight: 700; background: #f5b041; color: #fff; padding: 3px 5px; border-radius: 3px; z-index: 2;
        }
        /* Materials */
        .materials-pane { padding: 15px; }
        .material-section { margin-bottom: 25px; }
        .material-section h4 { margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #333; }
        .section-head { display: flex; align-items: center; margin-bottom: 10px; }
        .section-head h4 { margin: 0; }
        .color-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
        .color-box {
           aspect-ratio: 1.5;
           border-radius: 2px;
           cursor: pointer;
           box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
        }

        /* --- CANVAS AREA --- */
        .rd-canvas {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .topbar {
          height: 50px;
          background: #fff;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          padding: 0 20px;
          font-size: 13px;
          color: #555;
        }

        .app-title { font-weight: 700; color: #333; letter-spacing: 1px; }
        .middle-space { flex: 1; }

        .upgrade {
          background: #f5b041;
          border: none;
          padding: 6px 14px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 11px;
          cursor: pointer;
          color: #fff;
          margin-right: 15px;
        }

        .lang { margin-right: 15px; color: #555; }
        .project { color: #888; margin-right: 20px; }
        
        .actions { display: flex; gap: 10px; }
        .header-action { background: none; border: none; font-size: 16px; cursor: pointer; color: #666; opacity: 0.7; }
        .header-action:hover { opacity: 1; }

        .workspace {
          flex: 1;
          background: #fff;
          position: relative;
          overflow: hidden;
          background-image:
            linear-gradient(rgba(240, 240, 240, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240, 240, 240, 1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .workspace > canvas {
          position: relative;
          z-index: 1;
        }

        .instruction-overlay {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          pointer-events: none;
          z-index: 100;
          font-size: 13px;
        }
        
        .bottom-bar {
           position: absolute;
           bottom: 20px;
           right: 20px;
           background: #fff;
           padding: 8px 16px;
           border-radius: 20px;
           box-shadow: 0 2px 10px rgba(0,0,0,0.05);
           border: 1px solid #eee;
           z-index: 10;
        }
        
        .controls {
           display: flex;
           align-items: center;
           gap: 12px;
           font-size: 12px;
           color: #666;
        }
        
        .toggle-switch {
           width: 30px; height: 16px; background: #ddd; border-radius: 10px;
        }
      `}</style>
    </>
  );
}
