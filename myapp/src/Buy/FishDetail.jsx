import React from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./FishDetail.css";
// Load static data
import fishData from "../../Data/fish.json";
import predictedData from "../../Data/predicted.json";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


export default function FishDetail() {
  const { name } = useParams(); // e.g., Salmon, Tuna

  const historical = fishData[name] || [];
  const predicted = predictedData[name] || [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>{name} - Historical & Predicted Maps</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Historical Data Map */}
        <div>
          <h3>Historical Data</h3>
          <MapContainer center={[10, 78]} zoom={6} style={{ height: "400px", width: "500px" }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {historical.map((point, index) => (
              <Marker key={index} position={[point.latitude, point.longitude]}>
                <Popup>
                  Temp: {point.temperature}°C<br />
                  Time: {new Date(point.timestamp).toLocaleString()}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Predicted Data Map */}
        <div>
          <h3>Predicted Data</h3>
          <MapContainer center={[10, 78]} zoom={6} style={{ height: "400px", width: "500px" }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {predicted.map((point, index) => (
              <Marker key={index} position={[point.latitude, point.longitude]}>
                <Popup>Expected Location #{index + 1}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
