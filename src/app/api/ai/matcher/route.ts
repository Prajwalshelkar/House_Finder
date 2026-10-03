import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      workplace = "MIHAN",
      familyType = "YOUNG_FAMILY",
      budgetTier = "MID_RANGE",
      topPriority = "METRO",
    } = body;

    // Detailed Nagpur Locality Matrix
    const localityProfiles: Record<
      string,
      {
        name: string;
        tagline: string;
        avgRate: string;
        strengths: string[];
        metroDistance: string;
        topSchools: string;
        idealFor: string;
        baseScore: number;
      }
    > = {
      "Wardha Road": {
        name: "Wardha Road",
        tagline: "Metro Lifeline & Airport Expressway",
        avgRate: "₹4,800 - ₹5,800 / sq.ft",
        strengths: ["Direct Metro Orange Line", "Quick access to Airport & MIHAN", "Fast appreciating residential corridor"],
        metroDistance: "300m - 1km (Multiple Orange Line stations)",
        topSchools: "Narayana Vidyalayam, CPS Wardha Road, Delhi Public School",
        idealFor: "IT professionals, frequent flyers & modern high-rise living",
        baseScore: 82,
      },
      "Besa": {
        name: "Besa",
        tagline: "Peaceful Family Hub with Modern Townships",
        avgRate: "₹3,900 - ₹4,800 / sq.ft",
        strengths: ["Clean suburban environment", "High value for money 2 & 3 BHKs", "Great community spirit & parks"],
        metroDistance: "2.5 km to Chhatrapati Square Metro",
        topSchools: "Podar International, Sanjuba High School, Bhavan's",
        idealFor: "Young families seeking spacious homes within budget",
        baseScore: 80,
      },
      "Dharampeth": {
        name: "Dharampeth",
        tagline: "Nagpur’s Premier Cultural & High-End Enclave",
        avgRate: "₹8,000 - ₹10,500 / sq.ft",
        strengths: ["Nagpur’s highest status address", "West High Court Road shopping & cafes", "Exceptional civic infrastructure"],
        metroDistance: "1.5 km to Shankar Nagar / Dharampeth stations",
        topSchools: "Bhavan's BP Vidya Mandir, Somalwar High School",
        idealFor: "Affluent executives, doctors, and luxury home seekers",
        baseScore: 78,
      },
      "MIHAN": {
        name: "MIHAN",
        tagline: "Tech SEZ, AIIMS & Educational Hub",
        avgRate: "₹3,400 - ₹4,400 / sq.ft",
        strengths: ["Zero commute to Infosys, TCS & HCL", "Highest rental yields in Nagpur (6%+)", "Planned smart city infrastructure"],
        metroDistance: "Metro terminal right inside MIHAN",
        topSchools: "AIIMS Campus, IIM Nagpur, DPS MIHAN",
        idealFor: "Tech engineers, medical professionals & high-ROI investors",
        baseScore: 79,
      },
      "Manish Nagar": {
        name: "Manish Nagar",
        tagline: "Vibrant South Nagpur Commercial-Residential Belt",
        avgRate: "₹4,400 - ₹5,200 / sq.ft",
        strengths: ["Abundant markets, banks, and grocery hubs", "Easy connectivity to Somalwada and Wardha Road", "Solid resale liquidity"],
        metroDistance: "1 km to Ujjwal Nagar / Airport Metro",
        topSchools: "Center Point School, Somalwar Khamla",
        idealFor: "Working couples wanting convenience and vibrant daily markets",
        baseScore: 77,
      },
      "Ramdaspeth": {
        name: "Ramdaspeth",
        tagline: "Central Medical & Corporate District",
        avgRate: "₹8,800 - ₹11,000 / sq.ft",
        strengths: ["Heart of Nagpur medical specialists", "Serene leafy tree avenues", "Walk to Central Bazar Road"],
        metroDistance: "800m to Congress Nagar / Rahate Colony Metro",
        topSchools: "Center Point School Wardha Rd, St. Ursula",
        idealFor: "Doctors, advocates, and established business families",
        baseScore: 75,
      },
    };

    // Calculate Dynamic Match Scores
    const scoredLocalities = Object.values(localityProfiles).map((loc) => {
      let score = loc.baseScore;

      // Workplace adjustments
      if (workplace === "MIHAN") {
        if (loc.name === "MIHAN") score += 16;
        if (loc.name === "Wardha Road") score += 12;
        if (loc.name === "Besa") score += 8;
      } else if (workplace === "CENTRAL_NAGPUR") {
        if (loc.name === "Dharampeth") score += 15;
        if (loc.name === "Ramdaspeth") score += 14;
        if (loc.name === "Manish Nagar") score += 8;
      } else if (workplace === "HINGNA") {
        if (loc.name === "Besa") score += 10;
        if (loc.name === "Dharampeth") score += 9;
      }

      // Priority adjustments
      if (topPriority === "METRO") {
        if (loc.name === "Wardha Road") score += 10;
        if (loc.name === "MIHAN") score += 8;
      } else if (topPriority === "SCHOOLS") {
        if (loc.name === "Besa") score += 10;
        if (loc.name === "Dharampeth") score += 9;
      } else if (topPriority === "RENTAL_YIELD") {
        if (loc.name === "MIHAN") score += 12;
        if (loc.name === "Wardha Road") score += 7;
      } else if (topPriority === "PEACE") {
        if (loc.name === "Besa") score += 9;
        if (loc.name === "Dharampeth") score += 7;
      }

      // Budget adjustments
      if (budgetTier === "BUDGET" || budgetTier === "MID_RANGE") {
        if (loc.name === "Besa") score += 8;
        if (loc.name === "MIHAN") score += 8;
        if (loc.name === "Dharampeth") score -= 15;
        if (loc.name === "Ramdaspeth") score -= 15;
      } else if (budgetTier === "LUXURY") {
        if (loc.name === "Dharampeth") score += 16;
        if (loc.name === "Ramdaspeth") score += 14;
      }

      const matchPercent = Math.min(Math.max(score, 68), 98);

      return {
        ...loc,
        matchPercent,
      };
    });

    // Sort by match percentage descending
    scoredLocalities.sort((a, b) => b.matchPercent - a.matchPercent);
    const topMatches = scoredLocalities.slice(0, 3);

    // Fetch matching properties for the top 1st recommendation
    const topLocalityName = topMatches[0].name;
    const matchingProperties = await prisma.property.findMany({
      where: { locality: { contains: topLocalityName } },
      take: 2,
      select: {
        id: true,
        title: true,
        price: true,
        locality: true,
        bhk: true,
        images: true,
      },
    });

    const parsedProperties = matchingProperties.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
    }));

    return NextResponse.json({
      success: true,
      topMatches,
      matchingProperties: parsedProperties,
    });
  } catch (error) {
    console.error("Neighborhood Matcher Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to match neighborhoods" },
      { status: 500 }
    );
  }
}
