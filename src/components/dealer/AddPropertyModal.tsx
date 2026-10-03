"use client";

import { useState } from "react";
import { X, Plus, Building2, ShieldCheck, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { NAGPUR_LOCALITIES } from "@/types";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealerId: string;
  onSuccess: () => void;
}

export default function AddPropertyModal({
  isOpen,
  onClose,
  dealerId,
  onSuccess,
}: AddPropertyModalProps) {
  const [title, setTitle] = useState("");
  const [listingType, setListingType] = useState<"BUY" | "RENT">("BUY");
  const [propertyType, setPropertyType] = useState("APARTMENT");
  const [bhk, setBhk] = useState(2);
  const [price, setPrice] = useState("");
  const [areaSqFt, setAreaSqFt] = useState("");
  const [locality, setLocality] = useState<string>(NAGPUR_LOCALITIES[0]);
  const [address, setAddress] = useState("");
  const [furnishedStatus, setFurnishedStatus] = useState("SEMI_FURNISHED");
  const [reraNumber, setReraNumber] = useState("P505000" + Math.floor(10000 + Math.random() * 90000));
  const [amenities, setAmenities] = useState<string[]>([
    "Elevator",
    "Covered Parking",
    "24/7 Security",
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("/images/interior-1.jpg");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const samplePhotos = [
    { label: "Luxury Living Room", url: "/images/interior-1.jpg" },
    { label: "Gated Villa", url: "/images/villa-1.jpg" },
    { label: "Boulevard High-Rise", url: "/images/hero-banner.jpg" },
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          listingType,
          propertyType,
          bhk,
          price: Number(price),
          areaSqFt: Number(areaSqFt),
          locality,
          address: address || `${locality}, Nagpur`,
          furnishedStatus,
          amenities,
          images: [selectedPhoto],
          reraNumber,
          dealerId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to create property");
      }
    } catch (err) {
      console.error("Error creating property:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Post New Property Listing</h3>
              <p className="text-xs text-slate-400">
                Publish verified inventory to NagpurHomes Discovery & Map
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Listing Type & Property Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listing Type</label>
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setListingType("BUY")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    listingType === "BUY" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                  }`}
                >
                  For Sale
                </button>
                <button
                  type="button"
                  onClick={() => setListingType("RENT")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    listingType === "RENT" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                  }`}
                >
                  For Rent
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              >
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Independent Villa</option>
                <option value="COMMERCIAL">Commercial / Shop</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Headline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Somalwada Heights 3 BHK Luxury Apartment"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Price & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {listingType === "BUY" ? "Total Price (₹ INR)" : "Rent / month (₹)"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={listingType === "BUY" ? "e.g. 6500000" : "e.g. 22000"}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Super Built-up Area (Sq.Ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(e.target.value)}
                placeholder="e.g. 1250"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">BHK</label>
              <select
                value={bhk}
                onChange={(e) => setBhk(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              >
                <option value={1}>1 BHK</option>
                <option value={2}>2 BHK</option>
                <option value={3}>3 BHK</option>
                <option value={4}>4 BHK</option>
              </select>
            </div>
          </div>

          {/* Locality & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nagpur Locality <span className="text-red-500">*</span>
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              >
                {NAGPUR_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">MahaRERA Project ID</label>
              <input
                type="text"
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
                placeholder="P505000XXXXX"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Specific Street Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Orange City Hospital, Wardha Road, Nagpur"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          {/* Cover Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select High-Res Cover Visual
            </label>
            <div className="grid grid-cols-3 gap-2">
              {samplePhotos.map((photo) => (
                <button
                  key={photo.url}
                  type="button"
                  onClick={() => setSelectedPhoto(photo.url)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    selectedPhoto === photo.url
                      ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="relative h-14 rounded-lg overflow-hidden mb-1">
                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 truncate block">
                    {photo.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Amenities Included</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {availableAmenities.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-2 text-xs rounded-xl border font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{amenity}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? "Publishing Listing..." : "Publish to NagpurHomes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
