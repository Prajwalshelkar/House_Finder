import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatIndianCurrency } from "@/lib/utils";
import EmiCalculator from "@/components/property/EmiCalculator";
import PropertyDetailClient from "./PropertyDetailClient";
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
  ArrowLeft,
  Share2,
} from "lucide-react";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      dealer: true,
    },
  });

  if (!property) {
    notFound();
  }

  const parsedProperty = {
    ...property,
    listingType: property.listingType as any,
    propertyType: property.propertyType as any,
    furnishedStatus: property.furnishedStatus as any,
    amenities: JSON.parse(property.amenities || "[]") as string[],
    images: JSON.parse(property.images || "[]") as string[],
  };

  const pricePerSqFt =
    parsedProperty.listingType === "BUY" && parsedProperty.areaSqFt > 0
      ? Math.round(parsedProperty.price / parsedProperty.areaSqFt)
      : null;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Nagpur Properties</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-md">
              Ref ID: #{parsedProperty.id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Client Interactive Section (Gallery + Dealer Actions Modal) */}
        <PropertyDetailClient
          property={parsedProperty}
          pricePerSqFt={pricePerSqFt}
        />

        {/* EMI Calculator Section */}
        {parsedProperty.listingType === "BUY" && (
          <div className="mt-12">
            <EmiCalculator propertyPrice={parsedProperty.price} />
          </div>
        )}
      </div>
    </div>
  );
}
