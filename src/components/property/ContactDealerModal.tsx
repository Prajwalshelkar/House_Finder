"use client";

import { useState } from "react";
import {
  X,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import { PropertyItem, DealerItem } from "@/types";

interface ContactDealerModalProps {
  property: PropertyItem;
  dealer: DealerItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDealerModal({
  property,
  dealer,
  isOpen,
  onClose,
}: ContactDealerModalProps) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState(
    `Hi ${dealer.name}, I would like to schedule a site visit for "${property.title}" in ${property.locality}.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          dealerId: dealer.id,
          buyerName,
          buyerPhone,
          buyerEmail,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit inquiry");
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${dealer.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${dealer.name}, I just submitted an inquiry for "${property.title}" (Ref: ${property.id.slice(-6)}) on NagpurHomes. My name is ${buyerName || "a buyer"} (${buyerPhone || ""}). When can we connect?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Contact Assigned Dealer</h3>
              <p className="text-xs text-slate-400">
                Direct connect with {dealer.name} ({dealer.agencyName})
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

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Inquiry Received!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your interest in <strong className="text-slate-900">{property.title}</strong> has been logged in
                the dealer portal. <strong>{dealer.name}</strong> will reach out to you within 2 business hours.
              </p>

              {/* Direct WhatsApp CTA */}
              <div className="pt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Connect with Dealer on WhatsApp Now</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-700 underline font-semibold"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* RERA pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs">
                <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  MahaRERA: {dealer.reraNumber}
                </span>
                <span className="text-[11px] text-amber-800 font-bold">100% Verified</span>
              </div>

              {error && (
                <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
                  {error}
                </div>
              )}

              {/* Buyer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Adv. Amit Deshmukh"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+91 98220 XXXXX"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="amit.deshmukh@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Site Visit Request
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Sending Request..." : "Send Inspection Request"}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Your phone number will only be shared with the certified dealer for this property. Zero spam.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
