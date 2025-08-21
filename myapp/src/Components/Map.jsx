import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const AddMarker = ({ position, label }) => {
  const map = useMap();

  useEffect(() => {
    const marker = L.marker(position).addTo(map);
    marker.bindPopup(label).openPopup();

    return () => {
      map.removeLayer(marker);
    };
  }, [map, position, label]);

  return null;
};

function Map({ isExpanded }) {
  const locations = [
    { position: [13.1, 84.5], label: 'Location 1' },
    { position: [13.11, 84.52], label: 'Location 2' },
    { position: [13.09, 84.47], label: 'Location 3' },
    { position: [13.13, 84.49], label: 'Location 4' },
    { position: [13.08, 84.5], label: 'Location 5' },
    { position: [13.12, 84.53], label: 'Location 6' },
    { position: [13.1, 84.48], label: 'Location 7' }
  ];

  const height = isExpanded ? '100vh' : '400px';
  const width = isExpanded ? '100vw' : '300px';

  return (
    <MapContainer
      center={[13.1, 84.5]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height, width }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, index) => (
        <AddMarker key={index} position={loc.position} label={loc.label} />
      ))}
    </MapContainer>
  );
}

export default Map;