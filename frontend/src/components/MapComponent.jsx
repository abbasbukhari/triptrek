import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const MapComponent = ({ destinations = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Fix Leaflet icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
    });
    
    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add markers for destinations
    if (destinations && destinations.length > 0) {
      const bounds = L.latLngBounds();
      
      destinations.forEach(dest => {
        if (dest.coordinates && dest.coordinates.lat && dest.coordinates.lng) {
          const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng])
            .addTo(mapRef.current)
            .bindPopup(`
              <div class="map-popup">
                <h3>${dest.city}</h3>
                <p>${dest.country}</p>
              </div>
            `);
          
          markersRef.current.push(marker);
          bounds.extend([dest.coordinates.lat, dest.coordinates.lng]);
        }
      });
      
      // Fit bounds if we have markers
      if (markersRef.current.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      // Default view if no destinations
      mapRef.current.setView([20, 0], 2);
    }
    
    // Force resize after render
    setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 300);
    
  }, [destinations]);

  return <div ref={mapContainerRef} className="map-container"></div>;
};

export default MapComponent;