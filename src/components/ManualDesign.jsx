import React from "react";

export default function ManualDesign() {
  return (
    <>
      <div className="rd-root">
        {/* LEFT ICON BAR */}
        <aside className="rd-iconbar">
          <div className="icon active">🏠</div>
          <div className="icon">🧱</div>
          <div className="icon">🪑</div>
          <div className="icon">👤</div>
          <div className="icon">🔍</div>
        </aside>

        {/* LEFT TOOL PANEL */}
        <section className="rd-tools">
          <div className="height-control">
            <span>Walls height</span>
            <strong>280</strong>
          </div>

          <div className="tool-item">
            <span className="tool-icon">🧱</span> Wall
          </div>
          <div className="tool-item">
            <span className="tool-icon">⬜</span> Room
          </div>
          <div className="tool-item">
            <span className="tool-icon">⬢</span> Custom shape wall
          </div>
          <div className="tool-item">
            <span className="tool-icon">✂️</span> Wall cutout
          </div>
          <div className="tool-item">
            <span className="tool-icon">⬛</span> Floor
          </div>
          <div className="tool-item">
            <span className="tool-icon">✂️</span> Floor cutout
          </div>
          <div className="tool-item">
            <span className="tool-icon">📏</span> Change wall's height
          </div>
          <div className="tool-item">
            <span className="tool-icon">📤</span> Upload floorplan image
          </div>
        </section>

        {/* MAIN CANVAS */}
        <main className="rd-canvas">
          <div className="topbar">
            <button className="upgrade">Upgrade</button>
            <span className="lang">EN</span>
            <span className="project">My project</span>
          </div>

          <div className="workspace">
            <span>Drag scene</span>
          </div>
        </main>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        body {
          margin: 0;
        }

        .rd-root {
          display: flex;
          height: calc(100vh - 70px);
          margin-top: 70px;
          background: #f2f2f2;
        }

        /* ICON BAR */
        .rd-iconbar {
          width: 52px;
          background: #1f1f1f;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 10px;
        }

        .icon {
          width: 36px;
          height: 36px;
          margin: 8px 0;
          background: #2e2e2e;
          color: #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          cursor: pointer;
        }

        .icon.active,
        .icon:hover {
          background: #7ac943;
          color: #000;
        }

        /* TOOL PANEL */
        .rd-tools {
          width: 260px;
          background: #ffffff;
          border-right: 1px solid #ddd;
        }

        .height-control {
          padding: 14px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .tool-item {
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          font-size: 14px;
        }

        .tool-item:hover {
          background: #f6f6f6;
        }

        .tool-icon {
          font-size: 18px;
        }

        /* CANVAS */
        .rd-canvas {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .topbar {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          padding: 0 20px;
          border-bottom: 1px solid #ddd;
        }

        .upgrade {
          background: #ffc400;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .workspace {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 16px;
        }
          
      `}</style>
    </>
  );
}
