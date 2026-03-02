import { useState, useEffect } from "react";

const STYLE_OPTIONS = [
  "Contemporary",
  "Modern",
  "Minimal",
  "Luxury",
  "Scandinavian",
  "Industrial",
  "Traditional",
  "Bohemian"
];

const COLOR_OPTIONS = [
  { name: "Neutral", color: "#e5e7eb" },
  { name: "Warm", color: "#f59e0b" },
  { name: "Cool", color: "#60a5fa" },
  { name: "Earthy", color: "#a16207" },
  { name: "Monochrome", color: "#111827" },
  { name: "Pastel", color: "#fbcfe8" }
];

export default function VirtualAI() {
  const [room, setRoom] = useState("Living Room");
  const [scrollY, setScrollY] = useState(0);
  const [changeText, setChangeText] = useState("");
  const [fullPrompt, setFullPrompt] = useState([]);
  const [image, setImage] = useState(null);

  // NEW STATES (important)
  const [openSection, setOpenSection] = useState(null); // "style" | "color"
  const [style, setStyle] = useState("Contemporary");
  const [color, setColor] = useState("Neutral");

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

  const promptText = `
Room: ${room}
Style: ${style}
Color: ${color}
Changes: ${fullPrompt.join(", ")}
  `.trim();

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

        .ba-hero {
          border-radius: 28px;
          background:
            linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)),
            url(${image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"});
          background-size: cover;
          background-position: center;
          padding: 60px;
          transform: translateY(${scrollY * 0.15}px);
        }

        .ba-hero h1 {
          font-size: 48px;
          color: #111827;
        }

        .ba-panel {
          background: rgba(255,255,255,.92);
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
        }

        .room-pill.active {
          background: #111827;
          color: #fff;
        }

        /* DROPDOWN HEADER */
        .dropdown {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdown-options {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .option {
          padding: 10px;
          border-radius: 10px;
          background: #f3f4f6;
          cursor: pointer;
          text-align: center;
        }

        .option.active {
          background: #111827;
          color: #fff;
        }

        .color-chip {
          height: 42px;
          border-radius: 10px;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .change-box {
          border: 2px solid #ec4899;
          border-radius: 18px;
          padding: 14px;
          margin-top: 8px;
        }

        .add-btn {
          margin-top: 10px;
          background: #db2777;
          color: #fff;
          padding: 10px;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
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
          .ba-wrapper { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="ba-wrapper">
        <div className="ba-hero">
          <h1>
            My <span style={{ color: "#db2777" }}>AI Room Designer</span><br />
            Design Your Dream Space
          </h1>
        </div>

        <div className="ba-panel">
          <label className="upload">
            ＋ Upload room photo
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <div className="label">Room type</div>
          <div className="rooms">
            {["Living Room","Bedroom","Kitchen","Bathroom"].map(r => (
              <div
                key={r}
                className={`room-pill ${room === r ? "active" : ""}`}
                onClick={() => setRoom(r)}
              >
                {r}
              </div>
            ))}
          </div>

          {/* STYLE DROPDOWN */}
          <div className="label">Choose style</div>
          <div
            className="dropdown"
            onClick={() => setOpenSection(openSection === "style" ? null : "style")}
          >
            <span>{style}</span>
            <span>▾</span>
          </div>

          {openSection === "style" && (
            <div className="dropdown-options">
              {STYLE_OPTIONS.map(s => (
                <div
                  key={s}
                  className={`option ${style === s ? "active" : ""}`}
                  onClick={() => {
                    setStyle(s);
                    setOpenSection(null);
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* COLOR DROPDOWN */}
          <div className="label">Choose colors</div>
          <div
            className="dropdown"
            onClick={() => setOpenSection(openSection === "color" ? null : "color")}
          >
            <span>{color}</span>
            <span>▾</span>
          </div>

          {openSection === "color" && (
            <div className="dropdown-options">
              {COLOR_OPTIONS.map(c => (
                <div
                  key={c.name}
                  className="option"
                  onClick={() => {
                    setColor(c.name);
                    setOpenSection(null);
                  }}
                >
                  <div
                    className="color-chip"
                    style={{ background: c.color }}
                  />
                  {c.name}
                </div>
              ))}
            </div>
          )}

          <div className="label">What changes would you like?</div>
          <div className="change-box">
            <input
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
              placeholder="Add wooden flooring, modern sofa..."
            />
            <div className="add-btn" onClick={addChange}>
              Add change
            </div>
          </div>

          <div className="label">Final Prompt</div>
          <textarea value={promptText} readOnly />

          <div className="generate">Generate Design ✨</div>
        </div>
      </section>
    </>
  );
}