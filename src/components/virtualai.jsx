import { useState, useEffect } from "react";

export default function BeforeAfterHero() {
  const [room, setRoom] = useState("Living Room");
  const [scrollY, setScrollY] = useState(0);
  const [changeText, setChangeText] = useState("");
  const [fullPrompt, setFullPrompt] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addChange = () => {
    if (!changeText.trim()) return;
    setFullPrompt([...fullPrompt, changeText.trim()]);
    setChangeText("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const promptText = fullPrompt.join(" ");

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .ba-wrapper {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.2fr 1.4fr;
          gap: 40px;
          padding: 80px 60px;
          margin-top: 70px;
        }

        /* ⬇️ LEFT IMAGE (DYNAMIC) */
        .ba-hero {
          border-radius: 28px;
          overflow: hidden;
          background:
            linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)),
            url(${image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"});
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          padding: 60px;
          transform: translateY(${scrollY * 0.15}px);
          transition: background-image 0.4s ease;
        }

        .ba-hero h1 {
          font-size: 48px;
          color: #111827;
          max-width: 520px;
        }

        .ba-hero span { color: #db2777; }

        .ba-panel {
          background: rgba(255,255,255,.92);
          backdrop-filter: blur(18px);
          border-radius: 28px;
          padding: 32px;
          box-shadow: 0 25px 60px rgba(0,0,0,.1);
        }

        .upload {
          background: linear-gradient(135deg,#ec4899,#db2777);
          color: #fff;
          padding: 12px;
          border-radius: 14px;
          text-align: center;
          font-weight: 600;
          cursor: pointer;
        }

        .upload input { display: none; }

        .label {
          font-size: 13px;
          color: #6b7280;
          margin: 18px 0 8px;
        }

        .rooms {
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }

        .room-pill {
          padding: 10px 16px;
          border-radius: 999px;
          background: #f3f4f6;
          cursor: pointer;
          white-space: nowrap;
        }

        .room-pill.active,
        .room-pill:hover {
          background: #111827;
          color: #fff;
        }

        select, input, textarea {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
        }

        textarea {
          resize: none;
          min-height: 70px;
        }

        .change-box {
          border: 2px solid #ec4899;
          border-radius: 18px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .change-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-btn {
          background: #e5e7eb;
          color: #9ca3af;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
        }

        .add-btn.active {
          background: #db2777;
          color: #fff;
        }

        .generate {
          margin-top: 26px;
          background: linear-gradient(135deg,#f472b6,#db2777);
          color: #fff;
          padding: 18px;
          border-radius: 18px;
          text-align: center;
          font-weight: 600;
          cursor: pointer;
        }

        @media(max-width: 900px){
          .ba-wrapper {
            grid-template-columns: 1fr;
            padding: 40px 24px;
          }
        }
      `}</style>

      <section className="ba-wrapper">
        {/* LEFT IMAGE */}
        <div className="ba-hero">
          <h1>
            My <span>AI Room Designer</span><br />
            Design Your Dream Space Online
          </h1>
        </div>

        {/* RIGHT FORM */}
        <div className="ba-panel">
          <label className="upload">
            ＋ Upload room photo
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <div className="label">What type of room?</div>
          <div className="rooms">
            {["Living Room","Dining Room","Bedroom","Kitchen","Office"].map(r => (
              <div
                key={r}
                className={`room-pill ${room === r ? "active" : ""}`}
                onClick={() => setRoom(r)}
              >
                {r}
              </div>
            ))}
          </div>

          <div className="label">Choose style</div>
          <select>
            <option>Contemporary</option>
            <option>Modern Indian</option>
            <option>Minimal</option>
            <option>Luxury</option>
          </select>

          <div className="label">Choose colors</div>
          <select>
            <option>Neutral</option>
            <option>Warm</option>
            <option>Cool</option>
            <option>Earthy</option>
          </select>

          <div className="label">What changes would you like?</div>
          <div className="change-box">
            <input
              type="text"
              placeholder="e.g. Add a modern sofa, paint walls light blue..."
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
            />

            <div className="change-actions">
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>↺ ↻</span>
              <div
                className={`add-btn ${changeText ? "active" : ""}`}
                onClick={addChange}
              >
                Add change
              </div>
            </div>
          </div>

          <div className="label">Full prompt</div>
          <textarea
            className="prompt-box"
            value={promptText}
            onChange={(e) => setFullPrompt(e.target.value.split(" "))}
          />

          <div className="generate">Generate Design ✨</div>
        </div>
      </section>
    </>
  );
}
