import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VirtualAI() {
  const navigate = useNavigate();
  const [room, setRoom] = useState("Living Room");
  const [style, setStyle] = useState("Contemporary");
  const [color, setColor] = useState("Neutral");
  const [changeText, setChangeText] = useState("");
  const [changes, setChanges] = useState([]);
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [promptText, setPromptText] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/signin");
    }
  }, [navigate]);

  const ROOM_TYPES = ["Living Room", "Dining Room", "Bedroom", "Kitchen", "Office"];
  const STYLE_OPTIONS = ["Contemporary", "Modern Indian", "Minimal", "Luxury"];
  const COLOR_OPTIONS = ["Neutral", "Warm", "Cool", "Earthy"];

  useEffect(() => {
    updatePrompt();
  }, [room, style, color, changes]);

  const updatePrompt = () => {
    const basePrompt = `A ${style} ${room} with ${color} colors. `;
    setPromptText(basePrompt + changes.join(", "));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setUploadStatus(true);
    };
    reader.readAsDataURL(file);
  };

  const addChange = () => {
    if (!changeText.trim()) return;
    setChanges([...changes, changeText.trim()]);
    setChangeText("");
  };

  const handleGenerate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to use AI features!");
      return;
    }

    if (!image) {
      alert("Please upload a room photo first!");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const res = await axios.post("http://localhost:5001/api/ai/generate-design", {
        roomType: room,
        style: style,
        colors: color,
        description: promptText,
        roomImage: image
      }, {
        headers: { "x-auth-token": token },
        timeout: 120000 // Increased frontend timeout to 2 minutes
      });

      if (res.data.success) {
        console.log("Image URL received:", res.data.imageUrl);
        const imageUrl = res.data.imageUrl;
        setGeneratedImage(imageUrl);
        setUploadStatus(false); // Reset upload status so it doesn't show "✓ Image is added"

        // ✅ SAVE DESIGN TO DATABASE
        try {
          await axios.post("http://localhost:5001/api/designs", {
            name: `${style} ${room}`,
            design_data: {
              room,
              style,
              color,
              prompt: promptText
            },
            thumbnail_url: imageUrl
          }, {
            headers: { "x-auth-token": token }
          });
          console.log("Design saved to database successfully");
        } catch (saveError) {
          console.error("Failed to save design to database:", saveError);
          // Don't alert here to not interrupt user flow, but log it
        }
      } else {
        alert(`Generation failed: ${res.data.message}\nDetail: ${res.data.detail || 'No detail available'}`);
      }
    } catch (error) {
      console.error("Full error object:", error);
      let errorMessage = "An error occurred during generation.";
      let detail = "";
      if (error.response) {
        errorMessage = `Server Error (${error.response.status})`;
        detail = JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = "No response from server. Make sure the backend is running on port 5001.";
      } else {
        errorMessage = error.message;
      }
      alert(`${errorMessage}\nDetail: ${detail}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <style>{`
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
          overflow: hidden;
          background: linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,.85)), 
            url('${image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}') center/cover no-repeat;
          display: flex;
          align-items: center;
          padding: 60px;
          transition: all .4s;
          position: relative;
          min-height: 500px;
          background-size: cover;
          background-position: center;
        }

        .ba-hero h1 {
          font-size: 48px;
          color: #111827;
          max-width: 520px;
          z-index: 1;
          transition: opacity 0.3s;
        }

        .download-overlay-btn {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #ec4899;
          color: #fff;
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          z-index: 10;
          box-shadow: 0 10px 25px rgba(236,72,153,0.4);
          transition: transform 0.2s;
        }

        .download-overlay-btn:hover {
          transform: translateX(-50%) scale(1.05);
        }

        .ba-hero span {
          color: #db2777;
        }

        .ba-hero .result-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 28px;
          z-index: 2;
          display: block;
          background: white;
        }

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
          display: block;
          margin-bottom: 10px;
        }

        .upload input {
          display: none;
        }

        .label {
          font-size: 13px;
          color: #6b7280;
          margin: 18px 0 8px;
        }

        .rooms {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 5px;
        }

        .room-pill {
          padding: 10px 16px;
          border-radius: 999px;
          background: #f3f4f6;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .room-pill.active, .room-pill:hover {
          background: #111827;
          color: #fff;
        }

        select, input, textarea {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          background: #fff;
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
          color: #4b5563;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
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
          transition: opacity 0.3s;
        }

        .generate.loading {
          opacity: 0.7;
          pointer-events: none;
        }

        @media(max-width:900px) {
          .ba-wrapper {
            grid-template-columns: 1fr;
            padding: 40px 24px;
          }
        }
      `}</style>

      <section className="ba-wrapper">
        <div className="ba-hero" style={
          isGenerating ? {
            background: '#f3f4f6 url("https://i.gifer.com/ZZ5H.gif") center no-repeat',
            backgroundSize: '50px'
          } : {}
        }>
          {!generatedImage && !isGenerating && (
            <h1 style={{ opacity: isGenerating ? '0.3' : '1' }}>
              My <span>AI Room Designer</span><br />Design Your Dream Space Online
            </h1>
          )}

          {generatedImage && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>
              <img src={generatedImage} className="result-img" alt="Generated Design" style={{ display: 'block', width: '100%', height: '100%' }} />
              <a
                href={generatedImage}
                download="My-AI-Design.png"
                className="download-overlay-btn"
                style={{ zIndex: 10 }}
              >
                Download Design ↓
              </a>
            </div>
          )}
        </div>

        <div className="ba-panel">
          <label className="upload">
            ＋ Upload room photo
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          {uploadStatus && (
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '5px', fontWeight: '600', textAlign: 'center' }}>
              ✓ Image is added
            </div>
          )}

          <div className="label">What type of room?</div>
          <div className="rooms">
            {ROOM_TYPES.map(r => (
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
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLE_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="label">Choose colors</div>
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {COLOR_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="label">What changes would you like?</div>
          <div className="change-box">
            <input
              type="text"
              value={changeText}
              onChange={(e) => setChangeText(e.target.value)}
              placeholder="e.g. Add a modern sofa, paint walls light blue..."
            />
            <div className="change-actions">
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>↺ ↻</span>
              <div className="add-btn" onClick={addChange}>Add change</div>
            </div>
          </div>

          <div className="label">Full prompt</div>
          <textarea
            className="prompt-box"
            value={promptText}
            readOnly
          />

          <div
            className={`generate ${isGenerating ? 'loading' : ''}`}
            onClick={handleGenerate}
          >
            {isGenerating ? 'Generating... ⏳' : 'Generate Design ✨'}
          </div>
        </div>
      </section>
    </>
  );
}