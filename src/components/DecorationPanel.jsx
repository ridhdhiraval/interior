import React, { useState } from 'react';
import { decorationData } from "../planner/decorationData";
import { usePlanner } from "../planner/PlannerContext";

export default function DecorationPanel({ searchTerm }) {
    const { state, actions } = usePlanner();
    const [catalogPath, setCatalogPath] = useState([]);
    const [materialScale, setMaterialScale] = useState(1.0);
    const [materialRotation, setMaterialRotation] = useState(0);

    const handleCatalogItemClick = (id) => {
        setCatalogPath([...catalogPath, id]);
    };

    const handleBack = () => {
        setCatalogPath(catalogPath.slice(0, -1));
    };

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

    if (currentCatId) {
        const catName = decorationData.categories.find(c => c.id === currentCatId)?.name || "Decoration";
        
        return (
            <div id="decoration-items-container">
                <div className="catalog-header-simple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8cc63f' }}><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                    <span className="header-title">{catName}</span>
                </div>
                <div className="catalog-back-header" onClick={handleBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ marginRight: '10px' }}><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
                    <span className="back-title">{catName}</span>
                </div>
                
                <div className="decoration-content">
                    {currentCatId === 'paint' ? (
                        <div className="paint-grid">
                            <div className="section-label">SOLID COLORS</div>
                            <div className="color-swatches">
                                {decorationData.paint.colors.map(color => (
                                    <div 
                                        key={color} 
                                        className="color-swatch" 
                                        style={{ background: color }}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("decorationItem", JSON.stringify({ type: 'paint', value: color }));
                                        }}
                                        onClick={() => actions.applyDecoration(state.selectedFurnitureId || state.selectedWallId, { type: 'paint', value: color })}
                                    ></div>
                                ))}
                            </div>
                            <div className="section-label">GRADIENTS</div>
                            <div className="gradient-list">
                                {decorationData.paint.gradients.map(grad => (
                                    <div 
                                        key={grad.name} 
                                        className="gradient-item" 
                                        style={{ background: grad.value }}
                                        onClick={() => actions.applyDecoration(state.selectedFurnitureId || state.selectedWallId, { type: 'gradient', value: grad.value, name: grad.name })}
                                    >
                                        {grad.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="material-grid">
                            {(decorationData.items[currentCatId] || []).filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => {
                                const accessible = isAccessible(item.plan || 'BASIC');
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`item-card ${!accessible ? 'locked' : ''}`} 
                                        draggable={accessible}
                                        onDragStart={(e) => {
                                            if (!accessible) return e.preventDefault();
                                            const dragData = { 
                                                type: 'material', 
                                                value: item.image, 
                                                scale: item.defaultScale ? (1 / item.defaultScale) / 50 : 2 
                                            };
                                            e.dataTransfer.setData("decorationItem", JSON.stringify(dragData));
                                        }}
                                        onClick={() => {
                                            if (!accessible) return;
                                            const applyData = { 
                                                type: 'material', 
                                                value: item.image, 
                                                scale: item.defaultScale ? (1 / item.defaultScale) / 50 : 2 
                                            };
                                            actions.applyDecoration(state.selectedFurnitureId || state.selectedWallId, applyData);
                                        }}
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
                    )}
                </div>

                {/* Material Properties */}
                <div className="material-properties">
                    <div className="prop-header">
                        <span>Material Properties</span>
                        <button className="reset-btn" onClick={() => actions.applyDecoration(state.selectedFurnitureId || state.selectedWallId, null)}>Reset</button>
                    </div>
                    {(() => {
                        const selectedId = state.selectedFurnitureId || state.selectedWallId;
                        const entity = state.furniture.find(f => f.id === selectedId) || 
                                       state.walls.find(w => w.id === selectedId) || 
                                       state.floors.find(f => f.id === selectedId);
                        const decor = entity?.decoration || {};
                        
                        return (
                            <>
                                <div className="prop-row">
                                    <div className="label-wrap">
                                        <span>Scale</span>
                                        <span>{(decor.materialScale || 1.0).toFixed(1)}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.1" 
                                        max="5" 
                                        step="0.1" 
                                        value={decor.materialScale || 1.0}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            actions.updateDecoration(selectedId, { materialScale: val });
                                        }}
                                    />
                                </div>
                                <div className="prop-row">
                                    <div className="label-wrap">
                                        <span>Rotation</span>
                                        <span>{decor.materialRotation || 0}°</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="360" 
                                        value={decor.materialRotation || 0}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            actions.updateDecoration(selectedId, { materialRotation: val });
                                        }}
                                    />
                                </div>
                            </>
                        );
                    })()}
                </div>

                <style>{`
                    .item-card.locked { cursor: not-allowed; opacity: 0.8; }
                    .pro-badge { position: absolute; top: 5px; right: 5px; background: #fbb03b; color: #fff; font-size: 9px; font-weight: bold; padding: 1px 3px; border-radius: 2px; z-index: 1; }
                `}</style>
            </div>
        );
    }

    return (
        <div id="decoration-categories-list">
            <div className="catalog-header-simple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8cc63f' }}><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                <span className="header-title">Decoration</span>
            </div>
            <div className="tool-list">
                {decorationData.categories.map(cat => (
                    <div key={cat.id} className="tool-item" onClick={() => handleCatalogItemClick(cat.id)}>
                        <div className="tool-icon-wrapper" style={{ fontSize: '20px' }}>{cat.icon}</div>
                        <div className="tool-text"><span className="title">{cat.name}</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
