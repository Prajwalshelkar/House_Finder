"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PropertyItem, NAGPUR_LOCALITIES, ListingType } from "@/types";
import { formatIndianCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  BedDouble,
  Maximize2,
  ExternalLink,
  MessageCircle,
  Filter,
  ShieldCheck,
  Building,
} from "lucide-react";

// SSR-safe dynamic import for Leaflet map
const NagpurMap = dynamic(() => import("@/components/map/NagpurMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[550px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-medium">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Nagpur City Map...</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [listingType, setListingType] = useState<ListingType | "">("");
  const [locality, setLocality] = useState<string>("");
  const [bhk, setBhk] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (listingType) params.set("type", listingType);
        if (locality) params.set("locality", locality);
        if (bhk) params.set("bhk", bhk);

        const res = await fetch(`/api/properties?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProperties(data.properties);
        }
      } catch (err) {
        console.error("Error loading properties for map:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, [listingType, locality, bhk]);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Map Header & Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Nagpur City Interactive Property Map
              </h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {properties.length} Active Pins
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore Dharampeth, Wardha Road, Besa, MIHAN, Sadar, and Sitabuldi geographically.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value as ListingType | "")}
              className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none"
            >
              <option value="">Buy & Rent</option>
              <option value="BUY">Buy Only</option>
              <option value="RENT">Rent Only</option>
            </select>

            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none"
            >
              <option value="">All Nagpur Localities</option>
              {NAGPUR_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none"
            >
              <option value="">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Sidebar + Map */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Properties Mini List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[500px] lg:h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Listings in Current View ({properties.length})</span>
            <span className="text-[11px] text-emerald-700">Click to focus pin</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {properties.map((prop) => {
              const isSelected = selectedPropertyId === prop.id;
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedPropertyId(prop.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all flex gap-3 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <Image
                      src={prop.images?.[0] || "/images/hero-banner.jpg"}
                      alt={prop.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-1 left-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-slate-900/80 text-white">
                      {prop.listingType}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-extrabold text-sm text-slate-900">
                          {formatIndianCurrency(prop.price)}
                          {prop.listingType === "RENT" && (
                            <span className="text-[10px] text-slate-500 font-normal"> / mo</span>
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-xs">
                          {prop.locality}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {prop.address}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                      <span>{prop.bhk} BHK • {prop.areaSqFt} sq.ft</span>
                      <Link
                        href={`/property/${prop.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Area (7 cols) */}
        <div className="lg:col-span-7 h-[500px] lg:h-[calc(100vh-12rem)]">
          <NagpurMap
            properties={properties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={(p) => setSelectedPropertyId(p.id)}
          />
        </div>
      </div>
    </div>
  );
}
