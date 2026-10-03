"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  locality: string;
  price: string;
}

export default function PropertyLocationMap({
  latitude,
  longitude,
  title,
  locality,
  price,
}: PropertyLocationMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 14,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          background: #059669;
          color: white;
          font-family: system-ui, sans-serif;
          font-weight: 800;
          font-size: 11px;
          padding: 5px 10px;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
          border: 2px solid white;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transform: translate(-50%, -50%);
          white-space: nowrap;
        ">
          <span>📍 ${price}</span>
        </div>
      `,
      iconSize: [80, 26],
      iconAnchor: [40, 13],
    });

    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; font-size: 12px; padding: 4px;">
        <strong style="color: #0f172a; display: block; margin-bottom: 2px;">${title}</strong>
        <span style="color: #64748b;">${locality}, Nagpur</span>
      </div>
    `);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, title, locality, price]);

  return (
    <div className="w-full h-[260px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
