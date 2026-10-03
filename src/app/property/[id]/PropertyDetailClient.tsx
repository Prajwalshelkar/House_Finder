"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PropertyItem } from "@/types";
import { formatIndianCurrency } from "@/lib/utils";
import ContactDealerModal from "@/components/property/ContactDealerModal";

const PropertyLocationMap = dynamic(
  () => import("@/components/map/PropertyLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[260px] bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">
        Loading Location Map...
      </div>
    ),
  }
);
import {
  MapPin,
  BedDouble,
  Maximize2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Star,
  Phone,
  MessageCircle,
  Building2,
  Share2,
  Check,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";

interface PropertyDetailClientProps {
  property: PropertyItem;
  pricePerSqFt: number | null;
}

export default function PropertyDetailClient({
  property,
  pricePerSqFt,
}: PropertyDetailClientProps) {
  const images = property.images && property.images.length > 0
    ? property.images
    : ["/images/hero-banner.jpg"];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = property.dealer?.whatsappNumber
    ? `https://wa.me/${property.dealer.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hi ${property.dealer.name}, I am inquiring about "${property.title}" in ${property.locality} (Ref: #${property.id.slice(-6).toUpperCase()}) on NagpurHomes. Please share more details.`
      )}`
    : "#";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Image Gallery */}
          <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 shadow-xs overflow-hidden">
            {/* Main Stage Image */}
            <div className="relative h-[320px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-slate-100">
              <Image
                src={images[activeImageIndex]}
                alt={property.title}
                fill
                priority
                className="object-cover transition-all duration-300"
              />

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold uppercase px-3 py-1.5 rounded-lg shadow-md backdrop-blur-md ${
                    property.listingType === "BUY"
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {property.listingType === "BUY" ? "For Sale" : "For Rent"}
                </span>

                {property.reraApproved && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-lg shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                    MahaRERA: {property.reraNumber || "A50500018921"}
                  </span>
                )}
              </div>

              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Share property link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? "border-emerald-600 ring-2 ring-emerald-500/20"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Title, Price & Address Header */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
                  <MapPin className="w-3.5 h-3.5" /> {property.locality}, Nagpur
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {property.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  {property.address}
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {formatIndianCurrency(property.price)}
                  {property.listingType === "RENT" && (
                    <span className="text-sm font-medium text-slate-500"> / month</span>
                  )}
                </div>
                {pricePerSqFt && (
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    ₹{pricePerSqFt.toLocaleString("en-IN")} / sq.ft
                  </p>
                )}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Configuration
                </span>
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-emerald-600" />
                  {property.bhk} BHK
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Built-up Area
                </span>
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-emerald-600" />
                  {property.areaSqFt} sq.ft
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Furnishing
                </span>
                <span className="text-base font-extrabold text-slate-900 capitalize">
                  {property.furnishedStatus.replace("_", " ").toLowerCase()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Possession
                </span>
                <span className="text-base font-extrabold text-emerald-700">
                  Ready to Move
                </span>
              </div>
            </div>

            {/* Property Overview Text */}
            <div className="pt-6">
              <h3 className="font-extrabold text-base text-slate-900 mb-3">About this property</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>

          {/* 3. Amenities List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Verified Amenities & Facilities
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Exact Property Location Map */}
          {property.latitude && property.longitude && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Locality & Neighborhood Map
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {property.locality}, Nagpur
                </span>
              </div>
              <PropertyLocationMap
                latitude={property.latitude}
                longitude={property.longitude}
                title={property.title}
                locality={property.locality}
                price={formatIndianCurrency(property.price)}
              />
            </div>
          )}
        </div>

        {/* Sidebar: Dealer Contact Card (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {property.dealer && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md sticky top-20">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Certified MahaRERA Agent
              </div>

              {/* Dealer Profile */}
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-emerald-100 shrink-0">
                  {property.dealer.avatarUrl ? (
                    <Image
                      src={property.dealer.avatarUrl}
                      alt={property.dealer.name}
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-emerald-800">
                      {property.dealer.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {property.dealer.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {property.dealer.agencyName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{property.dealer.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({property.dealer.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Credentials */}
              <div className="py-4 space-y-2.5 text-xs text-slate-600 border-b border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">RERA Registration:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {property.dealer.reraNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience in Nagpur:</span>
                  <span className="font-bold text-slate-800">
                    {property.dealer.experienceYears}+ Years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Localities Handled:</span>
                  <span className="font-bold text-slate-800">{property.locality}, Wardha Rd</span>
                </div>
              </div>

              {/* Bio snippet */}
              {property.dealer.bio && (
                <p className="text-xs text-slate-500 my-4 italic leading-relaxed">
                  &ldquo;{property.dealer.bio}&rdquo;
                </p>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Site Inspection</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat on WhatsApp Directly</span>
                </a>

                <a
                  href={`tel:${property.dealer.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {property.dealer.phone}</span>
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Lead Capture Modal */}
      {property.dealer && (
        <ContactDealerModal
          property={property}
          dealer={property.dealer}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
