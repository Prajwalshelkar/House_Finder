"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { PropertyItem } from "@/types";
import { formatIndianCurrency, NAGPUR_LOCALITY_COORDINATES } from "@/lib/utils";
import { MapPin, Navigation, ExternalLink, MessageCircle, Building2, BedDouble, Maximize2 } from "lucide-react";

interface NagpurMapProps {
  properties: PropertyItem[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (property: PropertyItem) => void;
}

export default function NagpurMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
}: NagpurMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [activeLocality, setActiveLocality] = useState<string>("All");

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // avoid re-init

    // Center on Nagpur
    const map = L.map(mapRef.current, {
      center: [21.1458, 79.0882],
      zoom: 12,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    // Standard OpenStreetMap tiles (100% free, no API key required)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return;

      const isBuy = property.listingType === "BUY";
      const formattedPrice = formatIndianCurrency(property.price);

      // Custom DivIcon for price tag
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="
            background: ${isBuy ? "#059669" : "#4f46e5"};
            color: #ffffff;
            font-family: system-ui, sans-serif;
            font-weight: 800;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
            border: 2px solid #ffffff;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transform: translate(-50%, -50%);
            white-space: nowrap;
          ">
            <span>${formattedPrice}</span>
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([property.latitude, property.longitude], {
        icon: customIcon,
      }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; width: 220px; overflow: hidden; border-radius: 12px;">
          <div style="position: relative; height: 110px; background: #e2e8f0;">
            <img 
              src="${property.images?.[0] || "/images/hero-banner.jpg"}" 
              style="width: 100%; height: 100%; object-fit: cover; display: block;" 
              alt="${property.title}"
            />
            <span style="
              position: absolute; 
              top: 6px; 
              left: 6px; 
              background: ${isBuy ? "#059669" : "#4f46e5"}; 
              color: white; 
              font-size: 10px; 
              font-weight: bold; 
              padding: 2px 6px; 
              border-radius: 4px;
            ">
              ${isBuy ? "FOR SALE" : "FOR RENT"}
            </span>
          </div>
          <div style="padding: 10px;">
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
              ${formattedPrice}
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #334155; line-height: 1.2; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${property.title}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
              📍 ${property.locality} • ${property.bhk} BHK
            </div>
            <a 
              href="/property/${property.id}" 
              style="
                display: block; 
                text-align: center; 
                background: #0f172a; 
                color: #ffffff; 
                text-decoration: none; 
                padding: 6px 10px; 
                font-size: 11px; 
                font-weight: 700; 
                border-radius: 6px;
              "
            >
              View Full Details →
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on("click", () => {
        if (onSelectProperty) onSelectProperty(property);
      });

      markersRef.current[property.id] = marker;
    });
  }, [properties, onSelectProperty]);

  // Handle selected property highlight & pan
  useEffect(() => {
    if (!selectedPropertyId || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedPropertyId];
    if (marker) {
      const latlng = marker.getLatLng();
      mapInstanceRef.current.flyTo(latlng, 15, { duration: 1 });
      marker.openPopup();
    }
  }, [selectedPropertyId]);

  // Jump to specific Nagpur locality
  const flyToLocality = (locName: string) => {
    setActiveLocality(locName);
    if (!mapInstanceRef.current) return;

    if (locName === "All") {
      mapInstanceRef.current.flyTo([21.1458, 79.0882], 12);
      return;
    }

    const coords = NAGPUR_LOCALITY_COORDINATES[locName];
    if (coords) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden shadow-md border border-slate-200">
      {/* Top Locality Quick Jump Pills */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pointer-events-auto">
        <button
          onClick={() => flyToLocality("All")}
          className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-md backdrop-blur-md transition-all shrink-0 ${
            activeLocality === "All"
              ? "bg-slate-900 text-white"
              : "bg-white/95 text-slate-700 hover:bg-white"
          }`}
        >
          All Nagpur
        </button>
        {Object.keys(NAGPUR_LOCALITY_COORDINATES).slice(0, 7).map((loc) => (
          <button
            key={loc}
            onClick={() => flyToLocality(loc)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-md backdrop-blur-md transition-all shrink-0 ${
              activeLocality === loc
                ? "bg-emerald-600 text-white"
                : "bg-white/95 text-slate-700 hover:bg-white"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
