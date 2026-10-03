"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  MapPin,
  Sparkles,
  Compass,
  Users,
  LayoutDashboard,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Discover", href: "/properties", icon: Building2 },
    { name: "Live Map", href: "/map", icon: MapPin },
    {
      name: "AI Valuation",
      href: "/ai-valuation",
      icon: Sparkles,
      badge: "AI",
    },
    { name: "Neighborhood Matcher", href: "/neighborhood-matcher", icon: Compass },
    { name: "Dealers", href: "/dealers", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% MahaRERA Verified Dealers
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Serving Nagpur: Dharampeth, Wardha Rd, Besa, MIHAN & 25+ localities
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">Nagpur Helpline: +91 712 2980 400</span>
            <Link
              href="/dealer-dashboard"
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              Dealer Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Nagpur<span className="text-emerald-600">Homes</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm border border-amber-300/60">
                  RERA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                Orange City Real Estate Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50/80"
                      : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/dealer-dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-600" />
              <span>Dealer Hub</span>
            </Link>

            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Explore Listings</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/dealer-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dealer Management Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
