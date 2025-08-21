import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function Profile() {
  const [fishData, setFishData] = useState({}); // Use object for JSON structure

  useEffect(() => {
    fetch("../Python/my_json.json")
      .then((res) => res.json())
      .then((data) => {
        setFishData(data);
      })
      .catch((err) => console.error("Failed to load JSON:", err));
  }, []);

  // Fix for default marker icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f2f5f9;
          color: #333;
        }

        .dashboard {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 260px;
          background-color: #0d1b2a;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 20px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 20px;
        }

        .sidebar h2 {
          margin: 10px 0 5px;
        }

        .sidebar p {
          font-size: 0.9em;
          color: #aaa;
        }

        .nav-links {
          margin-top: 30px;
          width: 100%;
        }

        .nav-links a {
          display: block;
          padding: 12px 20px;
          color: #ccc;
          text-decoration: none;
          border-radius: 6px;
          transition: 0.2s;
        }

        .nav-links a:hover {
          background-color: #1b263b;
          color: white;
        }

        .main {
          flex: 1;
          padding: 40px;
        }

        .section {
          background-color: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
        }

        .section h3 {
          margin-bottom: 20px;
          font-size: 1.4em;
          color: #0d1b2a;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px 40px;
        }

        .info-item strong {
          display: block;
          font-size: 0.85em;
          color: #666;
        }

        .info-item span {
          font-size: 1.05em;
          font-weight: 500;
        }

        .stats-grid {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .stat-card {
          flex: 1;
          background-color: #e8f1ff;
          border-left: 6px solid #0077cc;
          padding: 20px;
          border-radius: 8px;
        }

        .stat-card h4 {
          margin: 0 0 8px;
          font-size: 1.2em;
          color: #003366;
        }

        .map-box {
          height: 300px;
          border-radius: 10px;
          overflow: hidden;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .history-table th,
        .history-table td {
          padding: 12px 16px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .history-table th {
          background-color: #f0f8ff;
          color: #003366;
        }

        .history-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            flex-direction: column;
          }

          .dashboard {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            padding: 20px;
          }

          .main {
          
            padding: 20px;
          }
        }
      `}</style>

      <div className="dashboard">
        <div className="sidebar">
          <div style={{ textAlign: "center" }}>
            <img
              src="../src/assets/harsha.jpg"
              alt="avatar"
              className="avatar"
            />
            <h2>Dobby Fisher</h2>
            <p>Fisherman | Bay of Bengal</p>
          </div>
          <div className="nav-links">
            <a href="#">Dashboard</a>
            <a href="#">Catch Records</a>
            <a href="#">Weather</a>
            <a href="#">Log Out</a>
          </div>
        </div>

        <div className="main">
          {/* Fisherman Info */}
          <div className="section">
            <h3>Fisherman Profile</h3>
            <div className="info-grid">
              <div className="info-item"><strong>Name</strong><span>Dobby Fisher</span></div>
              <div className="info-item"><strong>License ID</strong><span>TN-FSH-2025-0093</span></div>
              <div className="info-item"><strong>Phone</strong><span>+91 91234 56789</span></div>
              <div className="info-item"><strong>Region</strong><span>Tamil Nadu Coast</span></div>
              <div className="info-item"><strong>Experience</strong><span>12 Years</span></div>
              <div className="info-item"><strong>Boat Name</strong><span>Sea Rider</span></div>
            </div>
          </div>

          {/* Stats */}
          <div className="section">
            <h3>Fish Tracking Project Summary</h3>
            <div className="stats-grid">
              <div className="stat-card"><h4>Unique Fish Types</h4><p>{Object.keys(fishData).length}</p></div>
              <div className="stat-card"><h4>Fish Zones Marked</h4><p>1 coastal hotspot</p></div>
              <div className="stat-card"><h4>Last Sync</h4><p>3 days ago</p></div>
              <div className="stat-card"><h4>Research Partners</h4><p>2 institutes</p></div>
            </div>
          </div>

          {/* Map Section */}
          <div className="section">
            <h3>Tracking Map</h3>
            <div className="map-box">
              <MapContainer center={[13.0878, 80.2785]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Object.entries(fishData).map(([fishType, fishArray]) =>
                  fishArray.map((fish, index) => (
                    <Marker
                      key={`${fishType}-${index}`}
                      position={[fish.latitude, fish.longitude]}
                    >
                      <Popup>
                        <b>{fish.english_name}</b><br />
                        {fish.native_name}<br />
                        {new Date(fish.timestamp).toLocaleString()}
                      </Popup>
                    </Marker>
                  ))
                )}
              </MapContainer>
            </div>
          </div>

          {/* Catch History Table */}
          <div className="section">
            <h3>Catch History</h3>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Fish Name</th>
                  <th>Native Name</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(fishData).map(([fishType, fishArray]) =>
                  fishArray.map((entry, index) => (
                    <tr key={`${fishType}-${index}`}>
                      <td>{new Date(entry.timestamp).toLocaleString()}</td>
                      <td>{entry.english_name}</td>
                      <td>{entry.native_name}</td>
                      <td>{entry.latitude}</td>
                      <td>{entry.longitude}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
