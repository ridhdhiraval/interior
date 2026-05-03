import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlannerCanvas from "./PlannerCanvas";
import { usePlanner } from "../planner/PlannerContext";
import { 
  catalogCategories, 
  catalogSubCategories, 
  catalogItems 
} from "../planner/furnitureData";
import DecorationPanel from "./DecorationPanel";
import ProfilePage from "./ProfilePage";

export default function ManualDesign() {
  const navigate = useNavigate();
  const { state, actions } = usePlanner();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/signin");
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState('construction'); // construction, furniture, decoration, search
  const [catalogPath, setCatalogPath] = useState([]); // ['living', 'upholstered']
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [materialScale, setMaterialScale] = useState(1.0);
  const [materialRotation, setMaterialRotation] = useState(0);

  const handleToolClick = (tool) => {
    actions.setTool(tool === state.activeTool ? null : tool);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCatalogPath([]);
    actions.setTool(null);
    if (tab === 'construction') {
      actions.setViewMode('2D');
    } else {
      actions.setViewMode('3D');
    }
  };

  const handleCatalogItemClick = (id) => {
    setCatalogPath([...catalogPath, id]);
  };

  const handleFurnitureBack = () => {
    setCatalogPath(catalogPath.slice(0, -1));
  };

  // --- Render Panels ---

  const renderConstructionPanel = () => (
    <div id="construction-tab" className="tab-content active">
      <div className={`tool-item ${!state.activeTool ? 'active' : ''}`} onClick={() => handleToolClick(null)}>
        <div className="tool-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
        </div>
        <div className="tool-text"><span className="title">Select / Pan</span></div>
      </div>
      
      <div className="height-control">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#333' }}>Walls height {state.wallHeight}</span>
          <div className="height-arrows">
            <svg onClick={() => actions.setWallHeight(state.wallHeight + 10)} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
            <svg onClick={() => actions.setWallHeight(state.wallHeight - 10)} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      <div className={`tool-item ${state.activeTool === 'WALL' ? 'active' : ''}`} onClick={() => handleToolClick('WALL')}>
        <div className="tool-icon-wrapper">
          <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
            <path d="M10 10l12 2v18l-12-2V10z" fill="#999" stroke="#666" strokeWidth="1"/>
            <path d="M22 12l2 0.3v18l-2-0.3V12z" fill="#777" stroke="#666" strokeWidth="0.5"/>
            <path d="M24 22l8 8-2 2-8-8z" fill="#444"/>
            <path d="M30 28l2 2" stroke="#444" strokeWidth="2.5"/>
          </svg>
        </div>
        <div className="tool-text"><span className="title">Wall</span></div>
      </div>

      <div className={`tool-item ${state.activeTool === 'ROOM' ? 'active' : ''}`} onClick={() => handleToolClick('ROOM')}>
        <div className="tool-icon-wrapper">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 8h16v16h-16z" fill="#eee" stroke="#999" strokeWidth="1.5"/>
            <path d="M24 20l8 8-2 2-8-8z" fill="#444"/>
            <path d="M30 24l2 2" stroke="#444" strokeWidth="2"/>
          </svg>
        </div>
        <div className="tool-text"><span className="title">Room</span></div>
      </div>

      <div className={`tool-item ${state.activeTool === 'CUSTOM_SHAPE' ? 'active' : ''}`} onClick={() => handleToolClick('CUSTOM_SHAPE')}>
        <div className="tool-icon-wrapper">
          <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
            <path d="M12 10l8 4v12l-8-4v-12z" fill="#999" stroke="#666" strokeWidth="0.5"/>
            <path d="M20 14l8-4v12l-8 4v-12z" fill="#777" stroke="#666" strokeWidth="0.5"/>
            <path d="M12 10l8-4 8 4-8 4-8-4z" fill="#aaa" stroke="#666" strokeWidth="0.5"/>
            <path d="M26 24l6 6-2 2-6-6z" fill="#444"/>
            <path d="M30 28l2 2" stroke="#444" strokeWidth="2.5"/>
          </svg>
        </div>
        <div className="tool-text"><span className="title">Custom shape wall</span></div>
      </div>

      <div className={`tool-item ${state.activeTool === 'CHANGE_HEIGHT' ? 'active' : ''}`} onClick={() => handleToolClick('CHANGE_HEIGHT')}>
        <div className="tool-icon-wrapper">
          <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
            <path d="M12 24l8 4V12l-8-4v16z" fill="#999" stroke="#666" strokeWidth="0.5"/>
            <path d="M20 28l4-2V10l-4 2v16z" fill="#777" stroke="#666" strokeWidth="0.5"/>
            <path d="M28 14v12m-3-9l3-3 3 3m-6 6l3 3 3-3" stroke="#444" strokeWidth="2"/>
          </svg>
        </div>
        <div className="tool-text"><span className="title">Change wall's height</span></div>
      </div>

      <div className="thickness-control">
        <span style={{ fontSize: '14px', color: '#333' }}>Wall Thickness: {state.wallThickness}</span>
        <input 
          type="range" 
          min="5" 
          max="50" 
          value={state.wallThickness} 
          onChange={(e) => actions.setWallThickness(Number(e.target.value))}
        />
      </div>
    </div>
  );

  const renderFurniturePanel = () => {
    const currentCatId = catalogPath[catalogPath.length - 1];
    
    // Get user plan
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : { plan: 'FREE' };
    const userPlan = user.plan || 'FREE';

    // Helper to check if item is accessible
    const isAccessible = (itemPlan) => {
        if (userPlan === 'PRO') return true;
        if (userPlan === 'STANDARD') return itemPlan === 'BASIC' || itemPlan === 'STANDARD';
        return itemPlan === 'BASIC';
    };

    // Level 3: Items
    if (currentCatId && catalogItems[currentCatId]) {
        const items = catalogItems[currentCatId].filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        let parentId = catalogPath[catalogPath.length - 2];
        let parentName = catalogCategories.find(c => c.id === parentId)?.name || 
                        Object.values(catalogSubCategories).flat().find(s => s.id === parentId)?.name || "Catalog";
        let subName = Object.values(catalogSubCategories).flat().find(s => s.id === currentCatId)?.name || currentCatId;

        return (
            <div id="furniture-items-container" style={{ display: 'block' }}>
                <div className="catalog-header-breadcrumb">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}><path d="M21 13H3V5h18v8zM3 15h18v2H3v-2zM12 21c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/></svg>
                    <span className="breadcrumb-text">{parentName} • {subName}</span>
                </div>
                <div className="catalog-back-header" onClick={handleFurnitureBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ marginRight: '10px' }}><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
                    <span className="back-title">{subName}</span>
                </div>
                <div className="furniture-grid">
                    {items.map(item => {
                        const accessible = isAccessible(item.plan || 'BASIC');
                        return (
                            <div 
                                key={item.id} 
                                className={`item-card ${!accessible ? 'locked' : ''}`} 
                                draggable={accessible}
                                onDragStart={(e) => {
                                  if (!accessible) return e.preventDefault();
                                  e.dataTransfer.setData("furnitureItem", JSON.stringify(item));
                                  window.currentlyDraggedFurniture = item;
                                }}
                                onDragEnd={() => {
                                  window.currentlyDraggedFurniture = null;
                                }}
                                onClick={() => accessible && actions.startPlacingFurniture(item)}
                            >
                                {!accessible && <div className="pro-badge">{item.plan}</div>}
                                <div className="img-wrap">
                                    <img src={item.image} alt={item.name} style={{ opacity: accessible ? 1 : 0.5 }} />
                                </div>
                                <div className="item-name">{item.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Level 2: Sub-categories
    if (currentCatId && catalogSubCategories[currentCatId]) {
        const subCats = catalogSubCategories[currentCatId];
        const catName = catalogCategories.find(c => c.id === currentCatId)?.name || "Catalog";

        return (
            <div id="furniture-subcategory-list">
                <div className="catalog-header-simple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 13H3V5h18v8zM3 15h18v2H3v-2zM12 21c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/></svg>
                    <span className="header-title">{catName}</span>
                </div>
                <div className="catalog-back-header" onClick={handleFurnitureBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ marginRight: '10px' }}><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
                    <span className="back-title">{catName}</span>
                </div>
                <div className="category-list">
                    {subCats.map(sub => (
                        <div key={sub.id} className="category-card" onClick={() => handleCatalogItemClick(sub.id)}>
                            <div className="cat-name">{sub.name}</div>
                            <div className="cat-img-wrap">
                                <img src={sub.image} alt={sub.name} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Level 1: Categories
    return (
        <div id="furniture-category-list">
            <div className="catalog-header-simple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 13H3V5h18v8zM3 15h18v2H3v-2zM12 21c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/></svg>
                <span className="header-title">Products catalog</span>
            </div>
            <div className="category-list">
                {catalogCategories.map(cat => (
                    <div key={cat.id} className="category-card" onClick={() => handleCatalogItemClick(cat.id)}>
                        <div className="cat-name">{cat.name}</div>
                        <div className="cat-img-wrap">
                            <img src={cat.image} alt={cat.name} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="rd-root">
      {/* Sidebar Iconbar */}
      <aside className="rd-iconbar">
        <div className="icon user" onClick={() => setShowProfile(true)} title="Profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        </div>
        <div className={`icon ${activeTab === 'construction' ? 'active' : ''}`} onClick={() => handleTabClick('construction')} title="Construction">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div className={`icon ${activeTab === 'furniture' ? 'active' : ''}`} onClick={() => handleTabClick('furniture')} title="Furniture">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M12 13V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5"/><path d="M22 13V8a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v5"/></svg>
        </div>
        <div className={`icon ${activeTab === 'decoration' ? 'active' : ''}`} onClick={() => handleTabClick('decoration')} title="Decoration">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div className="icon spacer"></div>
        <div className={`icon ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')} title="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </aside>

      {/* Tools Sidebar */}
      <section className="rd-tools">
        {activeTab === 'construction' && renderConstructionPanel()}
        {activeTab === 'furniture' && (
            <div id="furniture-tab">
                <div className="search-box">
                    <input type="text" placeholder="Search furniture..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                {renderFurniturePanel()}
            </div>
        )}
        {activeTab === 'decoration' && <DecorationPanel searchTerm={searchTerm} />}
      </section>

      {/* Main Area */}
      <main className="rd-canvas">
        <div className="topbar">
          <div className="topbar-right">
            <button className="upgrade" onClick={() => window.location.href='/pricing'}>Upgrade</button>
            <span className="project" contentEditable suppressContentEditableWarning onBlur={(e) => actions.setProjectName(e.target.innerText)}>{state.projectName}</span>
            <div className="actions">
              <button id="clear-canvas" title="Clear All" onClick={actions.clearCanvas}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
              
              <button 
                id="delete-item" 
                title="Delete Selected" 
                onClick={actions.deleteSelected}
                disabled={!state.selectedWallId && !state.selectedFurnitureId}
                style={{ opacity: (state.selectedWallId || state.selectedFurnitureId) ? 1 : 0.3 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>

              <button 
                id="hd-render" 
                title="HD Rendering" 
                className="hd-btn"
                onClick={async () => {
                    const storedUser = localStorage.getItem('user');
                    const user = storedUser ? JSON.parse(storedUser) : { plan: 'FREE' };
                    
                    if (user.plan !== 'PRO') {
                        alert("HD Rendering is only available for PRO users. Please upgrade your plan.");
                        return;
                    }

                    const canvas = document.querySelector('canvas');
                    if (!canvas) return;
                    
                    const originalViewMode = state.viewMode;
                    if (originalViewMode !== '3D') actions.setViewMode('3D');
                    
                    setTimeout(() => {
                        const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
                        const link = document.createElement('a');
                        link.download = `${state.projectName}_HD.jpg`;
                        link.href = dataUrl;
                        link.click();
                        alert("HD Rendering complete!");
                    }, 500);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span className="hd-label">HD</span>
              </button>

              <button 
                id="save-project" 
                title="Save as Image"
                onClick={() => {
                    const canvas = document.querySelector('canvas');
                    if (!canvas) return;
                    
                    // Simple save as JPG
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
                    const link = document.createElement('a');
                    link.download = `${state.projectName}.jpg`;
                    link.href = dataUrl;
                    link.click();
                    alert("Project image saved successfully!");
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>

              <button id="undo-action" title="Undo" onClick={actions.undo} disabled={!state.canUndo} style={{ opacity: state.canUndo ? 1 : 0.3 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 6.7 6.7 0 0 0-5 2.2L3 13"></path></svg></button>
              <button id="redo-action" title="Redo" onClick={actions.redo} disabled={!state.canRedo} style={{ opacity: state.canRedo ? 1 : 0.3 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 6.7 6.7 0 0 1 5 2.2L21 13"></path></svg></button>
            </div>
          </div>
        </div>
        
        <div className="workspace">
          <PlannerCanvas />
        </div>

        <div className="bottom-controls">
          <div className="drag-scene-wrapper">
            <span>Drag scene</span>
            <div 
              className={`toggle-switch ${state.isDraggingScene ? 'active' : ''}`}
              onClick={() => actions.setIsDraggingScene(!state.isDraggingScene)}
            >
              <div className="toggle-knob"></div>
            </div>
          </div>
          
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => actions.setZoomLevel(state.zoomLevel - 10)}>−</button>
            <span className="zoom-value">{state.zoomLevel}%</span>
            <button className="zoom-btn" onClick={() => actions.setZoomLevel(state.zoomLevel + 10)}>+</button>
            
            <button className="reset-view-btn" onClick={actions.resetView}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            
            <div className="control-separator"></div>
            
            <div className="unit-display" onClick={() => actions.setUnit(state.unit === 'cm' ? 'm' : 'cm')}>
              {state.unit}
            </div>
          </div>
        </div>
      </main>

      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}

      <style>{`
        .rd-root { display: flex; height: calc(100vh - 70px); margin-top: 70px; background: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        /* Sidebar Iconbar */
        .rd-iconbar { width: 50px; background: #222; display: flex; flex-direction: column; align-items: center; border-right: 1px solid #111; padding-top: 10px; z-index: 100; }
        .icon { width: 40px; height: 40px; color: #999; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; position: relative; border-radius: 4px; margin-bottom: 5px; }
        .icon:hover { color: #fff; background: #333; }
        .icon.active { color: #fff; background: #8cc63f; }
        .icon.active svg { stroke: #fff; }
        .icon.user { background: transparent !important; margin-bottom: 20px; opacity: 0.8; }
        .icon.spacer { flex: 1; cursor: default; }
        .icon.spacer:hover { background: transparent; }
        
        /* Tools Sidebar */
        .rd-tools { width: 260px; background: #fff; border-right: 1px solid #ddd; display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.05); overflow-y: auto; z-index: 50; }
        .height-control { padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: #333; background: #fcfcfc; font-weight: 500; }
        .height-arrows { display: flex; flex-direction: column; gap: 2px; cursor: pointer; color: #666; }
        .tool-item { display: flex; align-items: center; padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #f5f5f5; transition: all 0.2s; }
        .tool-item:hover { background: #f8f9fa; }
        .tool-item.active { background: #f0fdf4; border-right: 3px solid #8cc63f; }
        .tool-icon-wrapper { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; margin-right: 15px; border-radius: 4px; background: #f0f0f0; }
        .tool-text { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .tool-text .title { font-size: 13px; color: #333; font-weight: 500; }
        .thickness-control { padding: 15px; border-top: 1px solid #eee; margin-top: auto; }
        .thickness-control input { width: 100%; margin-top: 8px; }

        /* Furniture/Catalog Styles */
        .search-box { padding: 10px 15px; border-bottom: 1px solid #eee; }
        .search-box input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; outline: none; }
        .catalog-header-simple { display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-bottom: 1px solid #eee; background: #fff; position: sticky; top: 0; z-index: 10; font-weight: 600; font-size: 15px; color: #111; }
        .catalog-header-breadcrumb { display: flex; align-items: center; gap: 8px; padding: 10px 15px; border-bottom: 1px solid #eee; background: #fff; font-size: 12px; color: #666; }
        .catalog-back-header { display: flex; align-items: center; padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #eee; background: #fff; }
        .back-title { font-size: 16px; font-weight: 600; color: #111; }
        
        .category-list { padding: 10px; display: grid; gap: 10px; }
        .category-card { flex-direction: column; padding: 10px 15px; border-bottom: 1px solid #eee; cursor: pointer; background: #fff; transition: background 0.2s; display: flex; }
        .category-card:hover { background: #f9f9f9; }
        .cat-name { font-weight: 500; font-size: 14px; color: #111; margin-bottom: 8px; }
        .cat-img-wrap { width: 100%; height: 140px; display: flex; align-items: center; justify-content: center; }
        .cat-img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .furniture-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 15px; }
        .item-card { border: 1px solid #eee; border-radius: 8px; background: #fff; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; padding: 10px; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
        .item-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .img-wrap { width: 100%; height: 100px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px; overflow: hidden; }
        .img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .item-name { font-size: 11px; font-weight: 500; color: #333; text-align: center; margin-top: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-card.locked { cursor: not-allowed; opacity: 0.8; }
        .pro-badge { position: absolute; top: 5px; right: 5px; background: #fbb03b; color: #fff; font-size: 9px; font-weight: bold; padding: 1px 3px; border-radius: 2px; z-index: 1; }

        /* Decoration Styles */
        .decoration-content { flex: 1; overflow-y: auto; }
        .paint-grid { padding: 15px; }
        .section-label { font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #666; }
        .color-swatches { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-bottom: 20px; }
        .color-swatch { width: 100%; padding-bottom: 100%; cursor: pointer; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); }
        .gradient-list { display: grid; gap: 8px; }
        .gradient-item { height: 40px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; padding: 0 12px; color: #fff; font-size: 12px; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        
        .material-properties { padding: 15px; border-top: 1px solid #eee; background: #fafafa; }
        .prop-header { font-weight: 600; font-size: 13px; color: #333; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .reset-btn { font-size: 11px; background: #eee; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; }
        .prop-row { margin-bottom: 10px; }
        .label-wrap { display: flex; justify-content: space-between; font-size: 11px; color: #666; margin-bottom: 4px; }
        .prop-row input { width: 100%; }

        /* Main Area Styles */
        .rd-canvas { flex: 1; display: flex; flex-direction: column; position: relative; background: #fff; }
        .topbar { height: 44px; background: #fff; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: flex-end; padding: 0 15px; z-index: 10; }
        .topbar-right { display: flex; align-items: center; gap: 15px; }
        .topbar-item { display: flex; align-items: center; gap: 5px; color: #666; font-size: 13px; cursor: pointer; }
        .upgrade { background: #fbb03b; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 600; font-size: 12px; cursor: pointer; color: #fff; text-transform: uppercase; }
        .lang { font-weight: 500; color: #333; }
        .project { color: #666; font-size: 13px; cursor: pointer; outline: none; border-bottom: 1px dashed transparent; }
        .project:hover { border-bottom-color: #999; }
        .actions { display: flex; gap: 2px; border-left: 1px solid #eee; padding-left: 10px; }
        .actions button { background: none; border: none; color: #777; cursor: pointer; padding: 6px; border-radius: 4px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .actions button:hover:not(:disabled) { background: #f5f5f5; color: #333; }
        .hd-btn { position: relative; }
        .hd-label { position: absolute; top: -5px; right: -5px; background: #ffb300; color: #000; font-size: 8px; padding: 1px 3px; border-radius: 4px; font-weight: bold; }

        .workspace { flex: 1; background: #fff; position: relative; overflow: hidden; }
        
        /* Updated Bottom Controls to match image */
        .bottom-controls { 
          position: absolute; 
          bottom: 20px; 
          right: 20px; 
          display: flex; 
          align-items: center; 
          background: #fff; 
          padding: 8px 16px; 
          border-radius: 8px; 
          box-shadow: 0 2px 15px rgba(0,0,0,0.08); 
          z-index: 20; 
          border: 1px solid #eee;
        }
        
        .drag-scene-wrapper { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding-right: 16px;
          border-right: 1px solid #eee;
          margin-right: 16px;
        }
        
        .drag-scene-wrapper span {
          font-size: 14px;
          color: #666;
          user-select: none;
        }
        
        .toggle-switch { 
          width: 38px; 
          height: 20px; 
          background: #e0e0e0; 
          border-radius: 10px; 
          position: relative; 
          cursor: pointer; 
          transition: background 0.3s;
        }
        
        .toggle-switch.active {
          background: #8cc63f;
        }
        
        .toggle-knob {
          position: absolute; 
          left: 2px; 
          top: 2px; 
          width: 16px; 
          height: 16px; 
          background: #fff; 
          border-radius: 50%; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        
        .toggle-switch.active .toggle-knob {
          transform: translateX(18px);
        }
        
        .zoom-controls { 
          display: flex; 
          align-items: center; 
          gap: 15px; 
        }
        
        .zoom-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: #666;
          cursor: pointer;
          padding: 0 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        
        .zoom-btn:hover {
          color: #333;
        }
        
        .zoom-value {
          font-size: 14px;
          color: #666;
          min-width: 45px;
          text-align: center;
        }
        
        .reset-view-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .reset-view-btn:hover {
          background: #f5f5f5;
          color: #333;
        }
        
        .control-separator {
          width: 1px;
          height: 24px;
          background: #eee;
          margin: 0 5px;
        }
        
        .unit-display { 
          font-size: 14px;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .unit-display:hover {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
