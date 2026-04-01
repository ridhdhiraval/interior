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

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [errorText, setErrorText] = useState("");

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

  const handleGenerate = async () => {
    if (!image) {
      setErrorText("Please upload a room photo first!");
      return;
    }
    setIsGenerating(true);
    setErrorText("");
    setGeneratedImage(null);

    try {
      const MISTRAL_API_KEY = "ANEg145zYTOLEUf65r2tVQhSQRemifNk";
      const systemPrompt = `You are an expert interior designer AI. I am providing you with an image of a room. Based on the following parameters: 
Room Type: ${room}
Style: ${style}
Color Scheme: ${color}
User Specific Redesign Instructions: ${fullPrompt.join(", ") || "None"}

Please text output ONLY a highly detailed, descriptive text prompt for an AI image generator (like Midjourney/Pollinations) that will redesign the given room according to these parameters. Focus heavily on lighting, textures, photorealism, and the specific style/colors requested. Keep the original room spatial layout in mind but radically transform its design. Do not include any other conversational text except the generation prompt itself.`;

      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "pixtral-12b-2409",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: systemPrompt },
                { type: "image_url", image_url: { url: image } }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate design prompt using Mistral");
      }

      let generatedPrompt = data.choices[0].message.content.trim();

      console.log("Mistral Raw:", generatedPrompt);
      // Clean up markdown block quotes or extra newlines Mistral might output
      generatedPrompt = generatedPrompt.replace(/```[a-z]*/gi, '').replace(/```/g, '');
      generatedPrompt = generatedPrompt.replace(/\n/g, ' ').replace(/\r/g, '').replace(/"/g, '').trim();

      // Enforce URL length safety
      if (generatedPrompt.length > 800) {
        generatedPrompt = generatedPrompt.substring(0, 800);
      }
      console.log("Mistral Cleaned:", generatedPrompt);

      const seed = Math.floor(Math.random() * 100000);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(generatedPrompt)}?width=1024&height=768&seed=${seed}`;

      // Directly setting the image URL ignores JS fetch blocking so the browser loads it properly natively.
      setGeneratedImage(pollinationsUrl);
    } catch (error) {
      console.error("Generation Error:", error);
      setErrorText(error.message || "An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

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

        .error-message {
          color: #dc2626;
          background: #fee2e2;
          padding: 12px;
          border-radius: 12px;
          margin-top: 15px;
          font-weight: 500;
          font-size: 14px;
          text-align: center;
        }

        .generation-loading {
          text-align: center;
          padding: 40px;
          background: rgba(255,255,255,0.9);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          margin-top: 20px;
        }

        .spinner {
          border: 4px solid rgba(219, 39, 119, 0.2);
          border-left-color: #db2777;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .before-after-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
          height: 100%;
          justify-content: center;
        }

        .image-box {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          background: #000;
        }

        .preview-img {
          width: 100%;
          height: auto;
          display: block;
          max-height: 400px;
          object-fit: cover;
        }

        .badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          backdrop-filter: blur(4px);
          z-index: 10;
        }

        .download-btn {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: #db2777;
          color: #fff;
          padding: 8px 16px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px;
          transition: 0.2s;
          cursor: pointer;
          border: none;
          z-index: 10;
        }

        .download-btn:hover {
          background: #be185d;
        }

        @media(max-width: 900px){
          .ba-wrapper { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="ba-wrapper">
        <div className="ba-hero">
          {!generatedImage && !isGenerating && !image && (
            <h1>
              My <span style={{ color: "#db2777" }}>AI Room Designer</span><br />
              Design Your Dream Space
            </h1>
          )}

          {isGenerating && (
            <div className="generation-loading">
              <div className="spinner"></div>
              <h3 style={{ color: '#111827', margin: '0 0 10px 0' }}>AI is designing your room...</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Analyzing with Mistral Vision & Generating Image.</p>
            </div>
          )}

          {(generatedImage || (!isGenerating && image)) && (
            <div className="before-after-container">
              {/* BEFORE IMAGE */}
              <div className="image-box">
                <img src={image} alt="Before" className="preview-img" />
                <span className="badge">Before</span>
              </div>

              {/* AFTER IMAGE */}
              {generatedImage && (
                <div className="image-box">
                  <img src={generatedImage} alt="After" className="preview-img" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                  <span className="badge">After (AI Design)</span>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = 'ai-room-design.jpg';
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="download-btn">
                    Download High Res
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ba-panel">
          <label className="upload">
            ＋ Upload room photo
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <div className="label">Room type</div>
          <div className="rooms">
            {["Living Room", "Bedroom", "Kitchen", "Bathroom"].map(r => (
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

          <div className="generate" onClick={handleGenerate}>
            {isGenerating ? "Generating..." : "Generate Design ✨"}
          </div>
          {errorText && <div className="error-message">{errorText}</div>}
        </div>
      </section>
    </>
  );
}