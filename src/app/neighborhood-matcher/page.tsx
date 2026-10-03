"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Sparkles,
  MapPin,
  CheckCircle2,
  Briefcase,
  Users,
  IndianRupee,
  Train,
  GraduationCap,
  Trees,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/utils";

interface MatchResult {
  name: string;
  tagline: string;
  avgRate: string;
  strengths: string[];
  metroDistance: string;
  topSchools: string;
  idealFor: string;
  matchPercent: number;
}

export default function NeighborhoodMatcherPage() {
  const [workplace, setWorkplace] = useState("MIHAN");
  const [familyType, setFamilyType] = useState("YOUNG_FAMILY");
  const [budgetTier, setBudgetTier] = useState("MID_RANGE");
  const [topPriority, setTopPriority] = useState("METRO");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [matchingProperties, setMatchingProperties] = useState<any[]>([]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai/matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workplace,
          familyType,
          budgetTier,
          topPriority,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.topMatches);
        setMatchingProperties(data.matchingProperties || []);
      }
    } catch (err) {
      console.error("Neighborhood Matcher failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-bold mb-3">
            <Compass className="w-4 h-4 text-indigo-600" />
            Nagpur Lifestyle Locality Matcher
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your Ideal Nagpur Neighborhood
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Tell us about your daily commute, family lifestyle, and budget. Our AI matches you with the best Nagpur localities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Questionnaire (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Your Living Preferences
            </h2>

            <form onSubmit={handleMatch} className="space-y-6">
              {/* 1. Commute */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  Primary Workplace / Commute Hub
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: "MIHAN", label: "MIHAN Tech SEZ / TCS" },
                    { id: "CENTRAL_NAGPUR", label: "Sitabuldi / Sadar CBD" },
                    { id: "WEST_NAGPUR", label: "Dharampeth / Med Enclave" },
                    { id: "HINGNA", label: "Hingna / MIDC Belt" },
                    { id: "WFH", label: "Remote / Work from Home" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setWorkplace(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        workplace === item.id
                          ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Family Profile */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  Who will live in this home?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: "YOUNG_FAMILY", label: "Family with School Kids" },
                    { id: "BACHELOR", label: "Working Professional" },
                    { id: "LARGE_FAMILY", label: "Multi-Gen with Seniors" },
                    { id: "INVESTOR", label: "Real Estate Investor" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFamilyType(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        familyType === item.id
                          ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Budget Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
                  Target Budget Tier
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {[
                    { id: "BUDGET", label: "Budget (Under ₹45 Lakhs)" },
                    { id: "MID_RANGE", label: "Value (₹45L - ₹80 Lakhs)" },
                    { id: "PREMIUM", label: "Premium (₹80L - ₹1.6 Cr)" },
                    { id: "LUXURY", label: "Luxury (₹1.6 Cr+)" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBudgetTier(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        budgetTier === item.id
                          ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Top Priority */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-indigo-600" />
                  Your #1 Priority
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    { id: "METRO", label: "Metro Proximity" },
                    { id: "SCHOOLS", label: "Reputed Schools" },
                    { id: "PEACE", label: "Greenery & Calm" },
                    { id: "RENTAL_YIELD", label: "Rental Return" },
                    { id: "SHOPPING", label: "Markets & Retail" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTopPriority(item.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        topPriority === item.id
                          ? "bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Matching Nagpur Neighborhoods...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>Find Matching Neighborhoods</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Side (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {results ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Top 3 Matched Nagpur Localities
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    AI Scored
                  </span>
                </div>

                {results.map((loc, index) => (
                  <div
                    key={loc.name}
                    className={`bg-white rounded-3xl border p-6 shadow-xs transition-all ${
                      index === 0
                        ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <h4 className="text-xl font-extrabold text-slate-900">{loc.name}</h4>
                          {index === 0 && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-sm">
                              Top Match
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{loc.tagline}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black text-indigo-700">
                          {loc.matchPercent}%
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Match Score
                        </span>
                      </div>
                    </div>

                    <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium mb-3 flex items-center justify-between">
                      <span>Average Rate: <strong>{loc.avgRate}</strong></span>
                      <span>Transit: <strong>{loc.metroDistance}</strong></span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      {loc.strengths.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Top Schools: {loc.topSchools}
                      </span>
                      <Link
                        href={`/properties?locality=${encodeURIComponent(loc.name)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>View Properties</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[440px]">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Discover Where You Belong in Nagpur
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-6">
                  Select your office location, family requirements, and budget to find whether Dharampeth, Besa, Wardha Road, or MIHAN best fits your lifestyle.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 text-left space-y-1">
                  <p className="font-semibold text-slate-800">Scored on:</p>
                  <p>✓ Nagpur Metro connectivity & daily commute</p>
                  <p>✓ ICSE/CBSE schools & healthcare proximity</p>
                  <p>✓ Current price per sq.ft vs your budget tier</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
