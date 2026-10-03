import Link from "next/link";
import Image from "next/image";
import HeroSearch from "@/components/home/HeroSearch";
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  Calculator,
  Compass,
  Building,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Users,
} from "lucide-react";

export default function Home() {
  const localities = [
    {
      name: "Dharampeth",
      tagline: "Prime Cultural & Luxury High-Rises",
      avgPrice: "₹7,800 - ₹9,500 / sq.ft",
      desc: "Nagpur’s most sought-after neighborhood for upscale dining, retail, and luxury apartments.",
      badge: "Premium",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      image: "/images/interior-1.jpg",
      href: "/properties?locality=Dharampeth",
    },
    {
      name: "Wardha Road",
      tagline: "Nagpur Metro & Airport Expressway",
      avgPrice: "₹4,500 - ₹5,800 / sq.ft",
      desc: "Fast-developing residential corridor with direct metro connectivity to Sitabuldi and MIHAN.",
      badge: "High Growth",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      image: "/images/hero-banner.jpg",
      href: "/properties?locality=Wardha+Road",
    },
    {
      name: "Besa & Manish Nagar",
      tagline: "Top Choice for Young Families",
      avgPrice: "₹3,900 - ₹4,800 / sq.ft",
      desc: "Peaceful residential atmosphere with top schools, shopping centers, and modern 2 & 3 BHK complexes.",
      badge: "Popular",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      image: "/images/villa-1.jpg",
      href: "/properties?locality=Besa",
    },
    {
      name: "MIHAN",
      tagline: "IT SEZ, AIIMS & IIM Nagpur Hub",
      avgPrice: "₹3,400 - ₹4,400 / sq.ft",
      desc: "Ideal for tech professionals working at TCS, Infosys, and HCL with superior rental yields.",
      badge: "High Rental Yield",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      image: "/images/interior-1.jpg",
      href: "/properties?locality=MIHAN",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Search */}
      <HeroSearch />

      {/* 2. Locality Showcase */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mb-3">
                <MapPin className="w-3.5 h-3.5" /> Prime Micro-Markets
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore Nagpur’s Top Neighborhoods
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
                Real-time price trends, landmark proximities, and verified property availability across Nagpur.
              </p>
            </div>
            <Link
              href="/map"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
            >
              <span>Explore Interactive Nagpur Map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {localities.map((loc) => (
              <Link
                key={loc.name}
                href={loc.href}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${loc.badgeColor}`}
                  >
                    {loc.badge}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-lg tracking-tight">{loc.name}</h3>
                    <p className="text-xs text-slate-200">{loc.tagline}</p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{loc.avgPrice}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {loc.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-emerald-600">
                    <span>View available homes</span>
                    <span className="text-emerald-600">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI Feature Callout Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Powered by Google Gemini AI
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Intelligent Real Estate Decision Tools
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Harness AI trained on Nagpur micro-market data to accurately value properties and match your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Valuation Card */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white overflow-hidden shadow-xl border border-emerald-800/40">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-6">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Smart Pricing Algorithm
                  </span>
                  <h3 className="text-2xl font-bold mt-1 mb-3 text-white">
                    Property Price Valuation Estimator
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Instant fair market price appraisal for apartments, villas, and plots in Dharampeth,
                    Besa, Wardha Road, and more. Analyzes sq.ft area, amenities, floor, and age of property.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Estimated Price Range & Price/sq.ft in INR</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Expected monthly rental yield benchmark</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>3-Year capital appreciation forecast</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/ai-valuation"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/30"
                >
                  <span>Estimate Property Value Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* AI Neighborhood Matcher Card */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white overflow-hidden shadow-xl border border-slate-800">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 mb-6">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Personalized Lifestyle Matcher
                  </span>
                  <h3 className="text-2xl font-bold mt-1 mb-3 text-white">
                    Nagpur Neighborhood Matcher
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Not sure where in Nagpur to settle? Answer a few questions about your office commute,
                    children’s schooling, budget, and lifestyle to discover your top 3 matching localities.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>MIHAN IT professionals vs South Nagpur families</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Nagpur Metro line proximity analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Top schools, hospitals, and green parks index</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/neighborhood-matcher"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/30"
                >
                  <span>Find My Ideal Locality</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pillars of Trust / Nagpur Real Estate Ecosystem */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Nagpur Trusts NagpurHomes
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Built ground-up to solve misinformation, fake listings, and unregulated broker markups in Nagpur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">100% MahaRERA Verified</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every dealer and developer profile displays authentic MahaRERA registration credentials so you
                transact with verified real estate professionals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Direct WhatsApp Connect</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No middleman delays. Connect instantly with the assigned dealer via WhatsApp with pre-filled
                property IDs for site visit scheduling.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Dealer CRM & Portal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dealers receive verified buyer inquiries directly in a dedicated dashboard with lead status
                tracking from inspection to final registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dealer Banner CTA */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-emerald-900/60 via-slate-800 to-slate-900 border border-emerald-500/30">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Are you a Nagpur Property Agent or Developer?
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Showcase Your Listings on Nagpur’s Premier Portal
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Get high-intent buyer inquiries directly on WhatsApp and manage all leads in your dealer CRM.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dealer-dashboard"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
              >
                Access Dealer Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
