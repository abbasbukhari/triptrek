import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon path issues in many build setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultCenter = [48.8566, 2.3522]; // Paris as default

export default function OSMMapView({ destinations }) {
  // Center on first destination if available
  const center =
    destinations.length && destinations[0].lat && destinations[0].lng
      ? [destinations[0].lat, destinations[0].lng]
      : defaultCenter;

  return (
    <MapContainer center={center} zoom={2} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {destinations.map((dest, idx) =>
        dest.lat && dest.lng ? (
          <Marker key={idx} position={[dest.lat, dest.lng]}>
            <Popup>
              <b>{dest.city}</b>
              <br />
              {dest.deal}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}