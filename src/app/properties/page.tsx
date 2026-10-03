"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "@/components/properties/PropertyCard";
import { PropertyItem, NAGPUR_LOCALITIES, ListingType } from "@/types";
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  MapPin,
  Building2,
  Sparkles,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import Link from "next/link";

function PropertyListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [type, setType] = useState<ListingType>(
    (searchParams.get("type") as ListingType) || "BUY"
  );
  const [locality, setLocality] = useState(searchParams.get("locality") || "");
  const [bhk, setBhk] = useState(searchParams.get("bhk") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [furnishedStatus, setFurnishedStatus] = useState(
    searchParams.get("furnishedStatus") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "featured");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (locality && locality !== "all") params.set("locality", locality);
      if (bhk && bhk !== "all") params.set("bhk", bhk);
      if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
      if (furnishedStatus && furnishedStatus !== "all")
        params.set("furnishedStatus", furnishedStatus);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [type, locality, bhk, propertyType, furnishedStatus, minPrice, maxPrice, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleResetFilters = () => {
    setType("BUY");
    setLocality("");
    setBhk("");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setFurnishedStatus("");
    setSortBy("featured");
    setSearch("");
    router.push("/properties");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <Link href="/" className="hover:text-emerald-600">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">Nagpur Properties</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Real Estate for {type === "BUY" ? "Sale" : "Rent"} in Nagpur
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Verified flats, villas, plots, and commercial units across Dharampeth, Wardha Road, Besa, and MIHAN.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 shadow-xs"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>View On Live Map</span>
            </Link>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-xs"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Top Filter Bar: Type & Quick Locality Pills */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Buy / Rent Switch */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start">
              <button
                onClick={() => setType("BUY")}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  type === "BUY"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Buy Properties
              </button>
              <button
                onClick={() => setType("RENT")}
                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                  type === "RENT"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Rent Homes
              </button>
            </div>

            {/* Keyword Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search project name, locality, landmark..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Sort & Layout Toggles */}
            <div className="flex items-center gap-3 self-end lg:self-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 border-none focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area">Area: Largest First</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                <button
                  onClick={() => setLayoutMode("grid")}
                  className={`p-1.5 rounded-md ${
                    layoutMode === "grid" ? "bg-white shadow-xs text-emerald-600" : "text-slate-400"
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode("list")}
                  className={`p-1.5 rounded-md ${
                    layoutMode === "list" ? "bg-white shadow-xs text-emerald-600" : "text-slate-400"
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? "block" : "hidden"
            } bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6 h-fit sticky top-20`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-slate-900">Filter Properties</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Locality Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Nagpur Locality
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">All Nagpur Localities</option>
                {NAGPUR_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* BHK Filter Pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["all", "1", "2", "3", "4"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBhk(item === "all" ? "" : item)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      (item === "all" && !bhk) || bhk === item
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item === "all" ? "Any" : `${item} BHK`}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range (Buy vs Rent) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Budget (Max Price)
              </label>
              {type === "BUY" ? (
                <div className="space-y-2">
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">Any Budget</option>
                    <option value="3500000">Up to ₹35 Lakhs</option>
                    <option value="6000000">Up to ₹60 Lakhs</option>
                    <option value="10000000">Up to ₹1 Crore</option>
                    <option value="20000000">Up to ₹2 Crores</option>
                    <option value="40000000">Up to ₹4 Crores</option>
                  </select>
                </div>
              ) : (
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">Any Rent</option>
                  <option value="15000">Up to ₹15,000 / mo</option>
                  <option value="25000">Up to ₹25,000 / mo</option>
                  <option value="40000">Up to ₹40,000 / mo</option>
                </select>
              )}
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Independent Villa</option>
                <option value="COMMERCIAL">Commercial / Shop</option>
              </select>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Furnishing
              </label>
              <select
                value={furnishedStatus}
                onChange={(e) => setFurnishedStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Any Furnishing</option>
                <option value="FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>

            {/* MahaRERA banner */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> MahaRERA Assurance
              </span>
              <p className="text-[11px] text-amber-800 leading-snug">
                All listed projects hold authentic MahaRERA verification registration.
              </p>
            </div>
          </aside>

          {/* Properties Grid Area */}
          <main className="lg:col-span-3">
            {/* Header info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-600">
                Found <span className="text-slate-900 font-extrabold">{properties.length}</span>{" "}
                properties in Nagpur
                {locality && (
                  <span>
                    {" "}
                    in <span className="text-emerald-700 font-bold">{locality}</span>
                  </span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-96 rounded-2xl bg-slate-200 animate-pulse border border-slate-300"
                  />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No properties match your specific criteria
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Try adjusting the budget slider, selecting a broader locality, or resetting your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  layoutMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    layout={layoutMode}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading Nagpur Properties...
        </div>
      }
    >
      <PropertyListingContent />
    </Suspense>
  );
}
