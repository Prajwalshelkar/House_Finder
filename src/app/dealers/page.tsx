import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  Building2,
  Award,
  ExternalLink,
  Users,
} from "lucide-react";

export const metadata = {
  title: "MahaRERA Verified Real Estate Dealers in Nagpur | NagpurHomes",
  description:
    "Browse Nagpur's top-rated, certified property consultants and real estate agencies across Dharampeth, Wardha Road, Besa, Manish Nagar, and MIHAN.",
};

export default async function DealersPage() {
  const dealers = await prisma.dealer.findMany({
    orderBy: { rating: "desc" },
    include: {
      _count: {
        select: { properties: true },
      },
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            100% MahaRERA Regulated Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Verified Real Estate Consultants in Nagpur
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Work with legitimate, vetted real estate advisors with deep micro-market experience in
            Dharampeth, Besa, Wardha Road, and MIHAN.
          </p>
        </div>

        {/* Dealers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {dealers.map((dealer) => (
            <div
              key={dealer.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-emerald-100 shrink-0 border-2 border-emerald-500/20">
                    {dealer.avatarUrl ? (
                      <Image
                        src={dealer.avatarUrl}
                        alt={dealer.name}
                        fill
                        unoptimized={true}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-emerald-800">
                        {dealer.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-xl font-extrabold text-slate-900">{dealer.name}</h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm">
                        Verified
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-emerald-700">{dealer.agencyName}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{dealer.rating}</span>
                        <span className="text-slate-400 font-normal">
                          ({dealer.reviewCount} reviews)
                        </span>
                      </div>
                      <span>•</span>
                      <span>{dealer.experienceYears}+ Yrs Experience</span>
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div className="py-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">MahaRERA Certificate:</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-sm">
                      {dealer.reraNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Listings on Portal:</span>
                    <span className="font-bold text-emerald-700">
                      {dealer._count.properties} Properties
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-3 mb-6">
                  &ldquo;{dealer.bio}&rdquo;
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${dealer.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${dealer.name}, I found your profile on NagpurHomes. I would like to discuss property options in Nagpur.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Dealer</span>
                </a>

                <Link
                  href={`/properties?search=${encodeURIComponent(dealer.name)}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>View Properties ({dealer._count.properties})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dealer Join Callout */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center max-w-4xl mx-auto border border-slate-800">
          <Users className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Are you a Licensed MahaRERA Broker in Nagpur?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Manage buyer inquiries in real time, build credibility with authentic reviews, and receive
            high-value buyers looking for properties in Dharampeth, Wardha Road, and Besa.
          </p>
          <Link
            href="/dealer-dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            <span>Open Dealer Management Portal</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
