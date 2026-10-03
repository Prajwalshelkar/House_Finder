import Link from "next/link";
import { Building2, ShieldCheck, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { NAGPUR_LOCALITIES } from "@/types";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Nagpur<span className="text-emerald-400">Homes</span>
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-sm border border-amber-400/40">
                  MahaRERA
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              The premier real estate discovery and verified dealer network dedicated to Nagpur.
              Find verified flats, villas, plots, and commercial spaces across Dharampeth, Besa,
              Wardha Road, MIHAN, and beyond with transparent pricing and direct dealer connect.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NagpurHomes Tech Hub, West High Court Road, Dharampeth, Nagpur - 440010</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Support: +91 712 2980 400 | Mon-Sat (9 AM - 7 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@nagpurhomes.in</span>
              </div>
            </div>
          </div>

          {/* Popular Localities */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Top Localities
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {NAGPUR_LOCALITIES.slice(0, 7).map((loc) => (
                <li key={loc}>
                  <Link
                    href={`/properties?locality=${encodeURIComponent(loc)}`}
                    className="hover:text-emerald-400 transition-colors flex items-center justify-between"
                  >
                    <span>{loc}</span>
                    <span className="text-xs text-slate-600">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick AI & Tools */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Smart Real Estate Tools
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/ai-valuation"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  AI Price Valuation Estimator
                </Link>
              </li>
              <li>
                <Link
                  href="/neighborhood-matcher"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  Nagpur Locality Matcher
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Interactive City Map
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=BUY"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  Buy Flats & Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=RENT"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Rentals & PGs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Dealers & Legal */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Dealer Network
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/dealer-dashboard"
                  className="hover:text-amber-300 text-amber-400/90 font-medium transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Dealer Management CRM
                </Link>
              </li>
              <li>
                <Link href="/dealers" className="hover:text-emerald-400 transition-colors">
                  Verified Dealer Directory
                </Link>
              </li>
              <li className="pt-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> MahaRERA Regulated
                  </div>
                  <p className="text-[11px] text-slate-500">
                    All agents and projects comply with Maharashtra Real Estate Regulatory Authority norms.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom disclaimer bar */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NagpurHomes Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>MahaRERA: A50500099881</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Nagpur, Maharashtra</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
