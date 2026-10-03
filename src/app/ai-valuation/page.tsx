"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Calculator,
  IndianRupee,
  TrendingUp,
  Building,
  CheckCircle2,
  Calendar,
  Home,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { NAGPUR_LOCALITIES } from "@/types";
import { formatIndianCurrency } from "@/lib/utils";

interface ValuationResult {
  locality: string;
  estimatedValue: number;
  minValue: number;
  maxValue: number;
  ratePerSqFt: number;
  monthlyRent: number;
  annualRentalYield: number;
  threeYearProjectedValue: number;
  growthRate: number;
  aiAnalysis: string;
  similarProperties: Array<{
    id: string;
    title: string;
    price: number;
    locality: string;
    bhk: number;
    areaSqFt: number;
    images?: string[];
  }>;
}

export default function AiValuationPage() {
  const [locality, setLocality] = useState("Wardha Road");
  const [propertyType, setPropertyType] = useState("APARTMENT");
  const [bhk, setBhk] = useState(2);
  const [areaSqFt, setAreaSqFt] = useState(1150);
  const [ageOfProperty, setAgeOfProperty] = useState("0_1_YR");
  const [furnishedStatus, setFurnishedStatus] = useState("SEMI_FURNISHED");
  const [amenities, setAmenities] = useState<string[]>([
    "Elevator",
    "Covered Parking",
    "24/7 Security",
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const availableAmenities = [
    "Elevator",
    "Covered Parking",
    "24/7 Security",
    "Power Backup",
    "Gym",
    "Swimming Pool",
    "Clubhouse",
    "Piped Gas",
  ];

  const toggleAmenity = (name: string) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locality,
          propertyType,
          bhk,
          areaSqFt,
          ageOfProperty,
          furnishedStatus,
          amenities,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.valuation);
      }
    } catch (err) {
      console.error("Valuation calculation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            AI-Powered Nagpur Micro-Market Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Property Price Valuation Estimator
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Get an instant, data-backed fair market appraisal for any residential or commercial property in Nagpur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              Property Parameters
            </h2>

            <form onSubmit={handleEstimate} className="space-y-5">
              {/* Locality */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nagpur Locality
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {NAGPUR_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type & BHK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="APARTMENT">Apartment / High-rise</option>
                    <option value="VILLA">Independent Villa / House</option>
                    <option value="COMMERCIAL">Commercial Office / Shop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Bedrooms (BHK)
                  </label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK / Penthouse</option>
                  </select>
                </div>
              </div>

              {/* Super Built-up Area */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Built-up Area (Sq.Ft)
                  </label>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {areaSqFt} sq.ft
                  </span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={4500}
                  step={50}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>400 sq.ft</span>
                  <span>1,200 sq.ft (Typical 2BHK)</span>
                  <span>4,500 sq.ft</span>
                </div>
              </div>

              {/* Age of Property & Furnishing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Age / Possession
                  </label>
                  <select
                    value={ageOfProperty}
                    onChange={(e) => setAgeOfProperty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                    <option value="0_1_YR">Brand New (0-1 Year)</option>
                    <option value="1_5_YR">1 to 5 Years Old</option>
                    <option value="5_10_YR">5 to 10 Years Old</option>
                    <option value="10_PLUS_YR">10+ Years Old</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Furnishing
                  </label>
                  <select
                    value={furnishedStatus}
                    onChange={(e) => setFurnishedStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="UNFURNISHED">Unfurnished</option>
                    <option value="SEMI_FURNISHED">Semi-Furnished</option>
                    <option value="FURNISHED">Fully Furnished</option>
                  </select>
                </div>
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Building Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableAmenities.map((item) => {
                    const isChecked = amenities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className={`p-2 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Nagpur Micro-Market Data...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run AI Property Valuation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Side (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-6 animate-in fade-in">
                {/* Main Estimated Value */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-sm">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Estimated Fair Market Value
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1 mb-2">
                    {formatIndianCurrency(result.estimatedValue)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <span>Range: {formatIndianCurrency(result.minValue)} - {formatIndianCurrency(result.maxValue)}</span>
                    <span className="font-bold text-emerald-400">
                      ₹{result.ratePerSqFt.toLocaleString("en-IN")}/sq.ft
                    </span>
                  </div>
                </div>

                {/* Rental & Growth KPIs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                      Expected Rent
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{result.monthlyRent.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-emerald-700 block font-semibold">
                      {result.annualRentalYield}% rental yield
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                      3-Yr Projection
                    </span>
                    <span className="text-lg font-black text-emerald-700">
                      {formatIndianCurrency(result.threeYearProjectedValue)}
                    </span>
                    <span className="text-[11px] text-slate-500 block font-semibold">
                      +{result.growthRate}% annual trend
                    </span>
                  </div>
                </div>

                {/* Gemini AI Summary */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Gemini AI Valuation Appraisal</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {result.aiAnalysis}
                  </p>
                </div>

                {/* Similar Properties Currently on Portal */}
                {result.similarProperties && result.similarProperties.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Matching Listings in {result.locality}
                    </h3>
                    <div className="space-y-2">
                      {result.similarProperties.map((prop) => (
                        <Link
                          key={prop.id}
                          href={`/property/${prop.id}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                        >
                          <div>
                            <p className="line-clamp-1 font-bold">{prop.title}</p>
                            <p className="text-slate-500 text-[11px]">
                              {prop.bhk} BHK • {formatIndianCurrency(prop.price)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Ready to Value Your Nagpur Property
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-6">
                  Select your locality (e.g. Dharampeth, Besa, Wardha Road), enter square footage and features to generate real-time fair market valuation.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 text-left space-y-1">
                  <p className="font-semibold text-slate-800">Includes:</p>
                  <p>✓ Price range in Lakhs / Crores</p>
                  <p>✓ Rate per sq.ft benchmark</p>
                  <p>✓ Rental yield & 3-year appreciation forecast</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
