export type ListingType = "BUY" | "RENT";

export type PropertyType =
  | "APARTMENT"
  | "INDEPENDENT_HOUSE"
  | "VILLA"
  | "PLOT"
  | "COMMERCIAL";

export type FurnishedStatus = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";

export interface PropertyItem {
  id: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  bhk: number;
  price: number; // in INR (e.g. 5500000)
  priceUnit: string;
  areaSqFt: number;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  furnishedStatus: FurnishedStatus;
  amenities: string[]; // parsed JSON
  images: string[]; // parsed JSON
  featured: boolean;
  reraApproved: boolean;
  reraNumber?: string | null;
  dealerId: string;
  dealer?: DealerItem;
  createdAt: string | Date;
}

export interface DealerItem {
  id: string;
  name: string;
  agencyName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  reraNumber: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  avatarUrl?: string | null;
  bio?: string | null;
  isVerified: boolean;
  propertiesCount?: number;
  createdAt?: string | Date;
}

export interface InquiryItem {
  id: string;
  propertyId: string;
  dealerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  status: "NEW" | "CONTACTED" | "VISIT_SCHEDULED" | "CLOSED";
  createdAt: string | Date;
  property?: PropertyItem;
  dealer?: DealerItem;
}

export interface SearchFilterParams {
  listingType?: ListingType;
  bhk?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  locality?: string;
  propertyType?: PropertyType | string;
  furnishedStatus?: FurnishedStatus | string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "area";
}

export const NAGPUR_LOCALITIES = [
  "Dharampeth",
  "Wardha Road",
  "Besa",
  "Manish Nagar",
  "Sitabuldi",
  "MIHAN",
  "Sadar",
  "Ramdaspeth",
  "Pratap Nagar",
  "Civil Lines",
  "Trimurti Nagar",
  "Hingna Road",
] as const;
