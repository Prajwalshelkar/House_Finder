import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(lakh % 1 === 0 ? 0 : 2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateEMI(principal: number, annualInterestRate = 8.5, tenureYears = 20) {
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  
  if (principal <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
    return { monthlyEmi: 0, totalAmount: 0, totalInterest: 0 };
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalAmount = emi * totalMonths;
  const totalInterest = totalAmount - principal;

  return {
    monthlyEmi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
  };
}

export const NAGPUR_LOCALITY_COORDINATES: Record<string, { lat: number; lng: number; tag: string }> = {
  "Dharampeth": { lat: 21.1442, lng: 79.0623, tag: "Upscale Cultural & Residential Hub" },
  "Wardha Road": { lat: 21.0854, lng: 79.0712, tag: "Metro Corridor & Airport Expressway" },
  "Besa": { lat: 21.0805, lng: 79.1034, tag: "Fastest Growing Residential Belt" },
  "Manish Nagar": { lat: 21.0963, lng: 79.0889, tag: "Family Friendly with High Demand" },
  "Sitabuldi": { lat: 21.1458, lng: 79.0882, tag: "Nagpur Central & Metro Interchange" },
  "MIHAN": { lat: 21.0256, lng: 79.0435, tag: "IT SEZ, AIIMS & Metro Reach" },
  "Sadar": { lat: 21.1625, lng: 79.0841, tag: "Heritage Shopping & Business Zone" },
  "Ramdaspeth": { lat: 21.1345, lng: 79.0734, tag: "Premium Medical & Corporate Address" },
  "Pratap Nagar": { lat: 21.1189, lng: 79.0556, tag: "Established South-West Nagpur" },
  "Civil Lines": { lat: 21.1578, lng: 79.0689, tag: "Lush Green VIP District" },
  "Trimurti Nagar": { lat: 21.1121, lng: 79.0432, tag: "Near Ring Road & Reputed Schools" },
  "Hingna Road": { lat: 21.0945, lng: 78.9956, tag: "Industrial & College Educational Corridor" },
};
