'use client';

import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { useState } from 'react';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  onMapClick: (lat: number, lng: number) => void;
}

export default function TravelMap({ onMapClick }: MapProps) {
  return (
    <MapContainer 
      center={[52.23, 21.01]} 
      zoom={5} 
      className="h-[500px] w-full rounded-2xl border-4 border-gray-800 shadow-2xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker onMapClick={onMapClick} />
    </MapContainer>
  );
}

function LocationMarker({ onMapClick }: MapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>Wybrane miejsce</Popup>
    </Marker>
  );
}