"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatIndianCurrency } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Trash2,
  Eye,
  BedDouble,
  Maximize2,
  Building,
} from "lucide-react";
import AddPropertyModal from "@/components/dealer/AddPropertyModal";
import { PropertyItem } from "@/types";

interface Dealer {
  id: string;
  name: string;
  agencyName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  reraNumber: string;
  avatarUrl?: string;
  rating: number;
}

interface Inquiry {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  status: "NEW" | "CONTACTED" | "VISIT_SCHEDULED" | "CLOSED";
  createdAt: string;
  property: {
    id: string;
    title: string;
    price: number;
    locality: string;
    bhk: number;
    images?: string;
  };
}

export default function DealerDashboardPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealerId, setSelectedDealerId] = useState<string>("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Properties Inventory State (for demo deletion/management)
  const [activeTab, setActiveTab] = useState<"inquiries" | "properties">("inquiries");
  const [dealerProperties, setDealerProperties] = useState<PropertyItem[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Load Dealers
  useEffect(() => {
    async function loadDealers() {
      try {
        const res = await fetch("/api/dealers");
        const data = await res.json();
        if (data.success && data.dealers.length > 0) {
          setDealers(data.dealers);
          setSelectedDealerId(data.dealers[0].id);
        }
      } catch (err) {
        console.error("Error loading dealers:", err);
      }
    }
    loadDealers();
  }, []);

  // Load Inquiries for selected dealer
  const loadInquiries = async () => {
    if (!selectedDealerId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("dealerId", selectedDealerId);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/inquiries?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load Properties for selected dealer
  const loadDealerProperties = async () => {
    if (!selectedDealerId) return;
    setLoadingProperties(true);
    try {
      const res = await fetch(`/api/properties?dealerId=${selectedDealerId}`);
      const data = await res.json();
      if (data.success) {
        setDealerProperties(data.properties);
      }
    } catch (err) {
      console.error("Error loading dealer properties:", err);
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    loadInquiries();
    loadDealerProperties();
  }, [selectedDealerId, statusFilter]);

  // Delete property handler (ideal for demoing)
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDealerProperties((prev) => prev.filter((p) => p.id !== propertyId));
        setDeleteConfirmId(null);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  // Update inquiry status
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setUpdatingId(inquiryId);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === inquiryId ? { ...inq, status: newStatus as any } : inq
          )
        );
      }
    } catch (err) {
      console.error("Error updating inquiry status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const currentDealer = dealers.find((d) => d.id === selectedDealerId);

  // Compute Metrics
  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((i) => i.status === "NEW").length;
  const scheduledVisits = inquiries.filter((i) => i.status === "VISIT_SCHEDULED").length;
  const closedDeals = inquiries.filter((i) => i.status === "CLOSED").length;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar: Dealer Profile Switcher */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  Dealer Portal & Lead CRM
                </h1>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-sm">
                  MahaRERA
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage buyer inquiries, schedule site inspections & update lead statuses
              </p>
            </div>
          </div>

          {/* Switch Dealer Profile Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 pl-2">Logged in as:</span>
            <select
              value={selectedDealerId}
              onChange={(e) => setSelectedDealerId(e.target.value)}
              className="bg-white font-bold text-xs text-slate-800 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {dealers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.agencyName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Dealer Snapshot */}
        {currentDealer && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md mb-8 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 overflow-hidden relative shrink-0">
                  {currentDealer.avatarUrl ? (
                    <Image
                      src={currentDealer.avatarUrl}
                      alt={currentDealer.name}
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-emerald-300">
                      {currentDealer.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{currentDealer.name}</h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                      Verified Agent
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{currentDealer.agencyName}</p>
                  <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                    MahaRERA: {currentDealer.reraNumber}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Property</span>
                </button>

                <Link
                  href={`/properties?search=${encodeURIComponent(currentDealer.name)}`}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" />
                  <span>My Listings</span>
                </Link>

                <button
                  onClick={loadInquiries}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
                  title="Refresh Leads"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Success Toast */}
        {postSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Property published successfully! It is now live on NagpurHomes Discovery & City Map.</span>
            </div>
            <Link href="/properties" className="underline hover:text-emerald-700">
              View on Portal →
            </Link>
          </div>
        )}

        {/* Delete Success Toast */}
        {deleteSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Property deleted successfully from database! Removed from discovery and city map.</span>
            </div>
          </div>
        )}

        {/* Dashboard KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Inquiries
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{totalLeads}</span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">All time leads received</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              New / Uncontacted
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-600">{newLeads}</span>
              <AlertCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting your response</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Site Visits Scheduled
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-blue-600">{scheduledVisits}</span>
              <CalendarCheck className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Active property visits</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Active Properties
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-600">{dealerProperties.length}</span>
              <Building className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Currently listed</p>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "inquiries"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Buyer Inquiries (CRM)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-200">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("properties");
              loadDealerProperties();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "properties"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>My Listed Properties (Inventory & Demo Manager)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-700 text-white">
              {dealerProperties.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Inquiries Management Section */}
        {activeTab === "inquiries" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header & Status Filter Pills */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Buyer Inquiries & Leads
              </h3>
              <p className="text-xs text-slate-500">
                Click status dropdown to update state directly in the database
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { label: "All Leads", val: "all" },
                { label: "New", val: "NEW" },
                { label: "Contacted", val: "CONTACTED" },
                { label: "Visits Scheduled", val: "VISIT_SCHEDULED" },
                { label: "Closed", val: "CLOSED" },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setStatusFilter(tab.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === tab.val
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Leads Listing */}
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Loading inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">No Inquiries Found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No buyer leads match the current filter. Try selecting &quot;All Leads&quot; or submit a test inquiry on any property!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inquiries.map((inq) => {
                const buyerWhatsApp = `https://wa.me/${inq.buyerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${inq.buyerName}, thank you for inquiring about "${inq.property?.title}" on NagpurHomes. I am ${currentDealer?.name} (${currentDealer?.agencyName}). How can I assist you with scheduling a site visit?`
                )}`;

                return (
                  <div
                    key={inq.id}
                    className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Buyer Info & Message */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-base text-slate-900">
                          {inq.buyerName}
                        </span>
                        <span className="text-xs text-slate-400">
                          • {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Property Inquired */}
                      {inq.property && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{inq.property.title}</span>
                          <span>({inq.property.locality} • {formatIndianCurrency(inq.property.price)})</span>
                        </div>
                      )}

                      {/* Buyer Message */}
                      <p className="text-xs text-slate-600 bg-slate-100/70 p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                        &ldquo;{inq.message}&rdquo;
                      </p>

                      {/* Buyer Contacts */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-900">{inq.buyerPhone}</strong>
                        </span>
                        {inq.buyerEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{inq.buyerEmail}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Column: Status selector + Direct Contact Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Status:</span>
                        <select
                          disabled={updatingId === inq.id}
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none transition-all cursor-pointer ${
                            inq.status === "NEW"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : inq.status === "CONTACTED"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : inq.status === "VISIT_SCHEDULED"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          <option value="NEW">🟡 New Lead</option>
                          <option value="CONTACTED">🔵 Contacted</option>
                          <option value="VISIT_SCHEDULED">🟣 Visit Scheduled</option>
                          <option value="CLOSED">🟢 Deal Closed</option>
                        </select>
                      </div>

                      {/* Quick Contact CTAs */}
                      <div className="flex items-center gap-2">
                        <a
                          href={buyerWhatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Buyer</span>
                        </a>

                        <a
                          href={`tel:${inq.buyerPhone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* TAB 2: Properties Inventory & Demo Manager */}
        {activeTab === "properties" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  My Active Inventory ({dealerProperties.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your listings, review details, or delete properties for demo purposes
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Property</span>
              </button>
            </div>

            {loadingProperties ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold">Loading listed properties...</p>
              </div>
            ) : dealerProperties.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-sm">No Properties Currently Listed</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                  You haven&apos;t posted any properties yet. Post your first listing to see it live!
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Listing Now</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {dealerProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    {/* Thumbnail & Specs */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={prop.images?.[0] || "/images/hero-banner.jpg"}
                          alt={prop.title}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-slate-900/80 text-white">
                          {prop.listingType}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {prop.locality}
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            {formatIndianCurrency(prop.price)}
                            {prop.listingType === "RENT" && (
                              <span className="text-[10px] text-slate-500 font-normal"> / mo</span>
                            )}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {prop.title}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>{prop.bhk} BHK</span>
                          <span>•</span>
                          <span>{prop.areaSqFt} sq.ft</span>
                          <span>•</span>
                          <span className="capitalize">{prop.propertyType.toLowerCase()}</span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-mono">
                          RERA ID: {prop.reraNumber || "Approved"}
                        </p>
                      </div>
                    </div>

                    {/* Actions: View & Delete */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {deleteConfirmId === prop.id ? (
                        <div className="flex items-center gap-2 bg-red-50 p-2 rounded-xl border border-red-200 animate-in fade-in">
                          <span className="text-xs font-bold text-red-800">Confirm delete?</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteProperty(prop.id)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <Link
                            href={`/property/${prop.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Live</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(prop.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all"
                            title="Delete this listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Property</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {selectedDealerId && (
        <AddPropertyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          dealerId={selectedDealerId}
          onSuccess={() => {
            setPostSuccess(true);
            loadDealerProperties();
            loadInquiries();
            setTimeout(() => setPostSuccess(false), 5000);
          }}
        />
      )}
    </div>
  );
}
