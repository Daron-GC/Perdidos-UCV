"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { useEffect } from "react";
import { SITES, MAP_CENTER, type Site } from "@/lib/mapa/sites";

function SearchControl() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    // @ts-ignore
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      placeholder: "Buscar lugar...",
      position: "topleft",
    })
      .on("markgeocode", (e: any) => {
        const bbox = e.geocode.bbox;
        const center = e.geocode.center;
        map.fitBounds(bbox);
        L.marker(center).addTo(map).bindPopup(e.geocode.name).openPopup();
      })
      .addTo(map);
    return () => { map.removeControl(geocoder); };
  }, [map]);
  return null;
}

function iconFor(site: Site) {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#06B6D4);display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4);">${site.emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export default function MapWithSearch() {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchControl />
      {SITES.map((site) => (
        <Marker key={site.id} position={[site.lat, site.lng]} icon={iconFor(site)}>
          <Popup>
            <strong>{site.emoji} {site.name}</strong>
            <p>{site.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}