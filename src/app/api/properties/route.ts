import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const listingType = searchParams.get("type");
    const locality = searchParams.get("locality");
    const bhk = searchParams.get("bhk");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const propertyType = searchParams.get("propertyType");
    const furnishedStatus = searchParams.get("furnishedStatus");
    const search = searchParams.get("search");
    const dealerId = searchParams.get("dealerId");
    const sortBy = searchParams.get("sortBy") || "featured";

    const where: Prisma.PropertyWhereInput = {};

    if (dealerId && dealerId !== "all") {
      where.dealerId = dealerId;
    }

    if (listingType && (listingType === "BUY" || listingType === "RENT")) {
      where.listingType = listingType;
    }

    if (locality && locality !== "all") {
      where.locality = {
        contains: locality,
      };
    }

    if (bhk && !isNaN(Number(bhk))) {
      where.bhk = Number(bhk);
    }

    if (propertyType && propertyType !== "all") {
      where.propertyType = propertyType;
    }

    if (furnishedStatus && furnishedStatus !== "all") {
      where.furnishedStatus = furnishedStatus;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        where.price.gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        where.price.lte = Number(maxPrice);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { locality: { contains: search } },
        { address: { contains: search } },
      ];
    }

    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: "desc" };

    if (sortBy === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price_desc") {
      orderBy = { price: "desc" };
    } else if (sortBy === "area") {
      orderBy = { areaSqFt: "desc" };
    } else if (sortBy === "featured") {
      orderBy = { featured: "desc" };
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy,
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            agencyName: true,
            phone: true,
            whatsappNumber: true,
            reraNumber: true,
            rating: true,
            reviewCount: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    const parsedProperties = properties.map((prop) => ({
      ...prop,
      amenities: JSON.parse(prop.amenities || "[]"),
      images: JSON.parse(prop.images || "[]"),
    }));

    return NextResponse.json({
      success: true,
      count: parsedProperties.length,
      properties: parsedProperties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      listingType = "BUY",
      propertyType = "APARTMENT",
      bhk = 2,
      price,
      areaSqFt,
      locality,
      address,
      furnishedStatus = "SEMI_FURNISHED",
      amenities = [],
      images = [],
      reraNumber,
      dealerId,
    } = body;

    if (!title || !price || !areaSqFt || !locality || !dealerId) {
      return NextResponse.json(
        { success: false, error: "Title, Price, Area, Locality, and Dealer are required." },
        { status: 400 }
      );
    }

    // Default coordinates based on locality
    const NAGPUR_COORDS: Record<string, { lat: number; lng: number }> = {
      "Dharampeth": { lat: 21.1442, lng: 79.0623 },
      "Wardha Road": { lat: 21.0854, lng: 79.0712 },
      "Besa": { lat: 21.0805, lng: 79.1034 },
      "Manish Nagar": { lat: 21.0963, lng: 79.0889 },
      "Sitabuldi": { lat: 21.1458, lng: 79.0882 },
      "MIHAN": { lat: 21.0256, lng: 79.0435 },
      "Sadar": { lat: 21.1625, lng: 79.0841 },
      "Ramdaspeth": { lat: 21.1345, lng: 79.0734 },
      "Pratap Nagar": { lat: 21.1189, lng: 79.0556 },
      "Civil Lines": { lat: 21.1578, lng: 79.0689 },
      "Trimurti Nagar": { lat: 21.1121, lng: 79.0432 },
      "Hingna Road": { lat: 21.0945, lng: 78.9956 },
    };

    const coords = NAGPUR_COORDS[locality] || { lat: 21.1458, lng: 79.0882 };

    const numPrice = Number(price);
    const priceUnit = numPrice >= 10000000 ? "Crores" : numPrice >= 100000 ? "Lakhs" : "Thousands";

    const defaultImages = images.length > 0 ? images : ["/images/interior-1.jpg", "/images/hero-banner.jpg"];

    const property = await prisma.property.create({
      data: {
        title,
        description: description || `Newly listed ${bhk} BHK ${propertyType.toLowerCase()} in prime ${locality}, Nagpur.`,
        listingType,
        propertyType,
        bhk: Number(bhk),
        price: numPrice,
        priceUnit,
        areaSqFt: Number(areaSqFt),
        locality,
        address: address || `${locality}, Nagpur - 440001`,
        latitude: coords.lat + (Math.random() - 0.5) * 0.005, // subtle jitter for distinct pin placement
        longitude: coords.lng + (Math.random() - 0.5) * 0.005,
        furnishedStatus,
        amenities: JSON.stringify(amenities),
        images: JSON.stringify(defaultImages),
        featured: false,
        reraApproved: true,
        reraNumber: reraNumber || "P50500099881",
        dealerId,
      },
      include: {
        dealer: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Property created successfully",
      property: {
        ...property,
        amenities: JSON.parse(property.amenities || "[]"),
        images: JSON.parse(property.images || "[]"),
      },
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create property" },
      { status: 500 }
    );
  }
}

