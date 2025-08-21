import React, { useState } from "react";
import { Link } from "react-router-dom";
import Trout from "../assets/trout.jpg";
import Salmon from "../assets/Salmon.jpg";
import Mac from "../assets/mackrel.jpg";
import Tuna from "../assets/tuna.jpg";
import tokenData from "../token.json";

const images = [
  { id: 1, src: Salmon, name: "Salmon" },
  { id: 2, src: Tuna, name: "Tuna" },
  { id: 3, src: Trout, name: "Trout" },
  { id: 4, src: Mac, name: "Mackerel" },
];

export default function Lee() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tokens, setTokens] = useState(() => {
  const saved = localStorage.getItem("tokens");
  return saved ? Number(saved) : tokenData.tokens; // Fallback to JSON tokens
});

  const [hoveredId, setHoveredId] = useState(null);
  const [message, setMessage] = useState("");

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFishClick = () => {
  const cost = 20;
  if (tokens >= cost) {
    const updatedTokens = tokens - cost;
    setTokens(updatedTokens);
    localStorage.setItem("tokens", updatedTokens); // Save to localStorage
    setMessage("");
  } else {
    setMessage("Insufficient tokens!");
  }
};


  return (
    <div className="app-container">
      <div className="background" />
      <header className="glass-header">
        <div className="logo">🐟 FISHNET</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <input
            type="text"
            placeholder="Search fish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="tokens">Tokens: {tokens}</div>
        </nav>
      </header>

      {message && (
        <div style={{ textAlign: "center", color: "red", marginTop: "10px" }}>
          {message}
        </div>
      )}

      <div className="dashboard-container">
        <div className="image-grid">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="image-card"
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleFishClick(img)}
            >
              <Link
                to={tokens >= 20 ? `/fish/${img.name}` : "#"}
                style={{ textDecoration: "none" }}
              >
                <img src={img.src} alt={img.name} className="image" />
                <div className="fish-name">{img.name}</div>
              </Link>
              {hoveredId === img.id && (
                <div className="token-hover">Enter (20 tokens)</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .app-container {
          position: relative;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          color: black;
        }

        .background {
          background: linear-gradient(to bottom right, #cceeff, #ffffff);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          filter: brightness(0.85);
        }

        .glass-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          color: white;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-links a {
          text-decoration: none;
          color: white;
          font-size: 16px;
          transition: 0.2s;
        }

        .nav-links a:hover {
          color: black;
        }

        .nav-links input {
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.25);
          color: white;
          backdrop-filter: blur(5px);
        }

        .tokens {
          color: white;
          font-weight: bold;
          background: rgba(0, 0, 0, 0.2);
          padding: 6px 12px;
          border-radius: 8px;
        }

        .dashboard-container {
          padding: 40px 30px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 30px;
        }

        .image-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s;
          cursor: pointer;
          position: relative;
        }

        .image-card:hover {
          transform: scale(1.05);
        }

        .image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .fish-name {
          text-align: center;
          padding: 12px;
          font-weight: bold;
          color: black;
          font-size: 18px;
        }

        .token-hover {
          position: absolute;
          bottom: 45px;
          left: 0;
          right: 0;
          text-align: center;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 8px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
