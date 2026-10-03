"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { NAGPUR_LOCALITIES, ListingType } from "@/types";

export default function HeroSearch() {
  const router = useRouter();
  const [listingType, setListingType] = useState<ListingType>("BUY");
  const [locality, setLocality] = useState<string>("");
  const [bhk, setBhk] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set("type", listingType);
    if (locality) params.set("locality", locality);
    if (bhk) params.set("bhk", bhk);
    if (budgetRange) {
      const [min, max] = budgetRange.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    if (searchQuery) params.set("search", searchQuery);

    router.push(`/properties?${params.toString()}`);
  };

  const quickBadges = [
    { label: "Besa 2 BHK under ₹50L", url: "/properties?locality=Besa&bhk=2&maxPrice=5000000" },
    { label: "Dharampeth Luxury", url: "/properties?locality=Dharampeth&bhk=3" },
    { label: "MIHAN Tech Corridor", url: "/properties?locality=MIHAN" },
    { label: "Wardha Rd Metro Flats", url: "/properties?locality=Wardha+Road" },
  ];

  return (
    <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner.jpg"
          alt="Nagpur Modern Real Estate"
          fill
          priority
          className="object-cover object-center opacity-35 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Nagpur’s Premier MahaRERA Verified Real Estate Network</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Find Your Perfect Home in <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Nagpur with Total Confidence
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
          Explore authentic listings with transparent pricing across Dharampeth, Wardha Road,
          Besa, MIHAN, and Sadar. Zero fake posts, 100% verified dealers.
        </p>

        {/* Search Box Card */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-900 border border-white/40">
          {/* Buy / Rent Switch */}
          <div className="flex items-center justify-start gap-2 mb-4 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setListingType("BUY")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                listingType === "BUY"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Buy Properties
            </button>
            <button
              type="button"
              onClick={() => setListingType("RENT")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                listingType === "RENT"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Rent a Flat / Villa
            </button>
          </div>

          {/* Search Form Fields */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Locality Dropdown */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Locality in Nagpur
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              >
                <option value="">All Nagpur Localities</option>
                {NAGPUR_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* BHK Selection */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-emerald-600" /> Bedrooms (BHK)
              </label>
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              >
                <option value="">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK / Penthouse</option>
              </select>
            </div>

            {/* Budget Range */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Budget Range
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              >
                {listingType === "BUY" ? (
                  <>
                    <option value="">Any Budget</option>
                    <option value="0-3000000">Under ₹30 Lakhs</option>
                    <option value="3000000-6000000">₹30L - ₹60 Lakhs</option>
                    <option value="6000000-10000000">₹60L - ₹1 Crore</option>
                    <option value="10000000-20000000">₹1 Cr - ₹2 Crores</option>
                    <option value="20000000-50000000">₹2 Cr+ Luxury</option>
                  </>
                ) : (
                  <>
                    <option value="">Any Rent</option>
                    <option value="0-12000">Under ₹12,000 / mo</option>
                    <option value="12000-20000">₹12,000 - ₹20,000 / mo</option>
                    <option value="20000-35000">₹20,000 - ₹35,000 / mo</option>
                    <option value="35000-60000">₹35,000+ / mo</option>
                  </>
                )}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Filter Pills */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular searches:
            </span>
            {quickBadges.map((badge) => (
              <button
                key={badge.label}
                type="button"
                onClick={() => router.push(badge.url)}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
              >
                {badge.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Highlights Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 pt-6 border-t border-slate-800/80 text-left">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
            <p className="text-2xl font-extrabold text-emerald-400">850+</p>
            <p className="text-xs text-slate-400">Verified Nagpur Listings</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
            <p className="text-2xl font-extrabold text-teal-300">120+</p>
            <p className="text-xs text-slate-400">MahaRERA Dealers</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
            <p className="text-2xl font-extrabold text-amber-400">25+</p>
            <p className="text-xs text-slate-400">Key Micro-Markets</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
            <p className="text-2xl font-extrabold text-sky-400">Instant</p>
            <p className="text-xs text-slate-400">WhatsApp Dealer Connect</p>
          </div>
        </div>
      </div>
    </div>
  );
}
