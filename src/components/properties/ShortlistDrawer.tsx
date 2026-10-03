"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSavedProperties } from "@/lib/useSavedProperties";
import { PropertyItem } from "@/types";
import { formatIndianCurrency, calculateEMI } from "@/lib/utils";
import {
  Heart,
  Scale,
  X,
  Trash2,
  ExternalLink,
  MessageCircle,
  Building2,
  BedDouble,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ShortlistDrawer() {
  const { savedIds, count, toggleSave } = useSavedProperties();
  const [isOpen, setIsOpen] = useState(false);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || savedIds.length === 0) return;

    async function loadSavedProperties() {
      setLoading(true);
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        if (data.success) {
          const matched = data.properties.filter((p: PropertyItem) =>
            savedIds.includes(p.id)
          );
          setProperties(matched);
        }
      } catch (e) {
        console.error("Failed to load saved properties:", e);
      } finally {
        setLoading(false);
      }
    }

    loadSavedProperties();
  }, [isOpen, savedIds]);

  if (count === 0) return null;

  return (
    <>
      {/* Floating Bottom Shortlist Bar */}
      <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900 text-white shadow-2xl border border-slate-700 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {count}
            </span>
          </div>
          <span className="text-xs font-extrabold tracking-tight">
            Shortlist & Compare ({count})
          </span>
          <Scale className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Compare Shortlisted Properties
                  </h3>
                  <p className="text-xs text-slate-400">
                    Side-by-side comparison of pricing, specs, RERA approval & estimated EMI
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-x-auto max-h-[75vh]">
              {loading ? (
                <div className="py-16 text-center text-slate-500">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold">Loading comparison data...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">Your shortlist is empty</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Click the heart icon on any property card to compare homes side-by-side.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((prop) => {
                    const pricePerSqFt =
                      prop.areaSqFt > 0 ? Math.round(prop.price / prop.areaSqFt) : null;
                    const { monthlyEmi } = calculateEMI(Math.round(prop.price * 0.8), 8.5, 20);

                    const whatsappUrl = prop.dealer?.whatsappNumber
                      ? `https://wa.me/${prop.dealer.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hi ${prop.dealer.name}, I am interested in comparing "${prop.title}" in ${prop.locality} on NagpurHomes.`
                        )}`
                      : "#";

                    return (
                      <div
                        key={prop.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between shadow-xs relative"
                      >
                        {/* Remove from shortlist button */}
                        <button
                          type="button"
                          onClick={() => toggleSave(prop.id)}
                          className="absolute top-6 right-6 z-10 p-1.5 rounded-full bg-white/90 text-slate-600 hover:text-red-500 shadow-sm"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          {/* Image */}
                          <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-slate-200">
                            <Image
                              src={prop.images?.[0] || "/images/hero-banner.jpg"}
                              alt={prop.title}
                              fill
                              className="object-cover"
                            />
                            <span className="absolute bottom-2 left-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-900/80 text-white">
                              {prop.locality}
                            </span>
                          </div>

                          {/* Price & Title */}
                          <div className="mb-4">
                            <div className="text-2xl font-black text-slate-900">
                              {formatIndianCurrency(prop.price)}
                              {prop.listingType === "RENT" && (
                                <span className="text-xs text-slate-500 font-normal"> / mo</span>
                              )}
                            </div>
                            <Link href={`/property/${prop.id}`}>
                              <h4 className="font-bold text-sm text-slate-900 hover:text-emerald-600 line-clamp-1 mt-0.5">
                                {prop.title}
                              </h4>
                            </Link>
                          </div>

                          {/* Matrix Rows */}
                          <div className="space-y-2 text-xs divide-y divide-slate-200/70 pb-4">
                            <div className="flex justify-between pt-1.5">
                              <span className="text-slate-500">Configuration:</span>
                              <span className="font-bold text-slate-800">{prop.bhk} BHK</span>
                            </div>

                            <div className="flex justify-between pt-1.5">
                              <span className="text-slate-500">Built-up Area:</span>
                              <span className="font-bold text-slate-800">{prop.areaSqFt} sq.ft</span>
                            </div>

                            {pricePerSqFt && (
                              <div className="flex justify-between pt-1.5">
                                <span className="text-slate-500">Rate / Sq.Ft:</span>
                                <span className="font-bold text-emerald-700">
                                  ₹{pricePerSqFt.toLocaleString("en-IN")}/sq.ft
                                </span>
                              </div>
                            )}

                            {prop.listingType === "BUY" && (
                              <div className="flex justify-between pt-1.5">
                                <span className="text-slate-500">Estimated EMI:</span>
                                <span className="font-bold text-indigo-700">
                                  ₹{monthlyEmi.toLocaleString("en-IN")}/mo
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between pt-1.5">
                              <span className="text-slate-500">Furnishing:</span>
                              <span className="font-semibold text-slate-800 capitalize">
                                {prop.furnishedStatus.replace("_", " ").toLowerCase()}
                              </span>
                            </div>

                            <div className="flex justify-between pt-1.5">
                              <span className="text-slate-500">RERA Status:</span>
                              <span className="font-bold text-amber-700 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                {prop.reraApproved ? "Verified" : "Under Review"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Direct CTAs */}
                        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <Link
                            href={`/property/${prop.id}`}
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
