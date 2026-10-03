"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  BedDouble,
  Maximize2,
  ShieldCheck,
  Star,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Heart,
} from "lucide-react";
import { PropertyItem } from "@/types";
import { formatIndianCurrency } from "@/lib/utils";
import { useSavedProperties } from "@/lib/useSavedProperties";

interface PropertyCardProps {
  property: PropertyItem;
  layout?: "grid" | "list";
}

export default function PropertyCard({ property, layout = "grid" }: PropertyCardProps) {
  const { isSaved, toggleSave } = useSavedProperties();
  const saved = isSaved(property.id);

  const pricePerSqFt =
    property.listingType === "BUY" && property.areaSqFt > 0
      ? Math.round(property.price / property.areaSqFt)
      : null;

  const displayImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : "/images/hero-banner.jpg";

  // Pre-fill WhatsApp message
  const whatsappUrl = property.dealer?.whatsappNumber
    ? `https://wa.me/${property.dealer.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hi ${property.dealer.name}, I am inquiring about "${property.title}" in ${property.locality} listed on NagpurHomes (Ref ID: ${property.id.slice(-6)}). Is it still available for a site visit?`
      )}`
    : "#";

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${
        layout === "list" ? "md:flex-row" : ""
      }`}
    >
      {/* Property Thumbnail */}
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          layout === "list" ? "h-64 md:h-auto md:w-80 shrink-0" : "h-56 w-full"
        }`}
      >
        <Image
          src={displayImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm backdrop-blur-md ${
                property.listingType === "BUY"
                  ? "bg-emerald-600/90 text-white"
                  : "bg-indigo-600/90 text-white"
              }`}
            >
              {property.listingType === "BUY" ? "For Sale" : "For Rent"}
            </span>

            {property.reraApproved && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-md shadow-xs backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                MahaRERA
              </span>
            )}
          </div>

          {/* Save / Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSave(property.id);
            }}
            className={`p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
              saved
                ? "bg-red-500 text-white scale-110"
                : "bg-white/80 text-slate-700 hover:bg-white hover:text-red-500"
            }`}
            title={saved ? "Remove from shortlist" : "Save property"}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Bottom Locality Tag on Image */}
        <div className="absolute bottom-2.5 left-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-950/75 text-white px-2.5 py-1 rounded-md backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {property.locality}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Rate/sq.ft */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {formatIndianCurrency(property.price)}
              </span>
              {property.listingType === "RENT" && (
                <span className="text-xs text-slate-500 font-medium"> / month</span>
              )}
            </div>
            {pricePerSqFt && (
              <span className="text-xs text-slate-500 font-medium">
                ₹{pricePerSqFt.toLocaleString("en-IN")}/sq.ft
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/property/${property.id}`}>
            <h3 className="font-bold text-base text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Address Snippet */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-4 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            {property.address}
          </p>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-xs font-medium mb-4">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-emerald-600" />
              <span>{property.bhk} BHK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-emerald-600" />
              <span>{property.areaSqFt} sq.ft</span>
            </div>
            <div className="text-right capitalize truncate font-medium text-slate-600">
              {property.furnishedStatus.replace("_", " ").toLowerCase()}
            </div>
          </div>
        </div>

        {/* Footer: Dealer & CTAs */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Dealer Mini Profile */}
          {property.dealer && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                {property.dealer.avatarUrl ? (
                  <Image
                    src={property.dealer.avatarUrl}
                    alt={property.dealer.name}
                    width={32}
                    height={32}
                    unoptimized={true}
                    className="object-cover"
                  />
                ) : (
                  property.dealer.name.charAt(0)
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">
                  {property.dealer.name}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{property.dealer.rating}</span>
                  <span>({property.dealer.reviewCount})</span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {/* WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* View Details */}
            <Link
              href={`/property/${property.id}`}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              <span>Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
