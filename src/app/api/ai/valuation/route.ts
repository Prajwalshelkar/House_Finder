import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

// Baseline benchmark pricing for Nagpur micro-markets (in ₹ / sq.ft)
const NAGPUR_PRICE_BENCHMARKS: Record<string, { baseRate: number; rentRatePerSqFt: number; growthRate: number }> = {
  "Dharampeth": { baseRate: 8500, rentRatePerSqFt: 22, growthRate: 7.5 },
  "Ramdaspeth": { baseRate: 9200, rentRatePerSqFt: 24, growthRate: 7.0 },
  "Civil Lines": { baseRate: 9800, rentRatePerSqFt: 25, growthRate: 6.5 },
  "Wardha Road": { baseRate: 5100, rentRatePerSqFt: 16, growthRate: 9.2 },
  "Besa": { baseRate: 4300, rentRatePerSqFt: 14, growthRate: 10.5 },
  "Manish Nagar": { baseRate: 4600, rentRatePerSqFt: 15, growthRate: 8.8 },
  "MIHAN": { baseRate: 3900, rentRatePerSqFt: 17, growthRate: 11.0 },
  "Sitabuldi": { baseRate: 7800, rentRatePerSqFt: 23, growthRate: 6.0 },
  "Sadar": { baseRate: 7400, rentRatePerSqFt: 21, growthRate: 6.2 },
  "Pratap Nagar": { baseRate: 6200, rentRatePerSqFt: 18, growthRate: 7.2 },
  "Trimurti Nagar": { baseRate: 5400, rentRatePerSqFt: 16, growthRate: 8.0 },
  "Hingna Road": { baseRate: 3600, rentRatePerSqFt: 12, growthRate: 7.8 },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      locality = "Wardha Road",
      propertyType = "APARTMENT",
      bhk = 2,
      areaSqFt = 1100,
      ageOfProperty = "NEW",
      furnishedStatus = "SEMI_FURNISHED",
      amenities = [],
      floor = 3,
    } = body;

    const area = Number(areaSqFt) || 1000;
    const benchmark = NAGPUR_PRICE_BENCHMARKS[locality] || {
      baseRate: 4800,
      rentRatePerSqFt: 15,
      growthRate: 8.0,
    };

    // Age multiplier
    let ageMultiplier = 1.0;
    if (ageOfProperty === "UNDER_CONSTRUCTION") ageMultiplier = 0.95;
    else if (ageOfProperty === "0_1_YR") ageMultiplier = 1.05;
    else if (ageOfProperty === "1_5_YR") ageMultiplier = 0.98;
    else if (ageOfProperty === "5_10_YR") ageMultiplier = 0.88;
    else if (ageOfProperty === "10_PLUS_YR") ageMultiplier = 0.78;

    // Furnishing multiplier
    let furnishMultiplier = 1.0;
    if (furnishedStatus === "FURNISHED") furnishMultiplier = 1.12;
    else if (furnishedStatus === "SEMI_FURNISHED") furnishMultiplier = 1.04;

    // Amenities boost
    const amenitiesBoost = Math.min((amenities.length || 0) * 0.015, 0.12);

    // Calculated Heuristic Baseline
    const calculatedRatePerSqFt = Math.round(
      benchmark.baseRate * ageMultiplier * furnishMultiplier * (1 + amenitiesBoost)
    );
    const estimatedValue = Math.round(calculatedRatePerSqFt * area);
    const minValue = Math.round(estimatedValue * 0.93);
    const maxValue = Math.round(estimatedValue * 1.08);

    const monthlyRent = Math.round(area * benchmark.rentRatePerSqFt * furnishMultiplier);
    const annualRentalYield = Number(((monthlyRent * 12) / estimatedValue * 100).toFixed(2));
    const threeYearProjectedValue = Math.round(
      estimatedValue * Math.pow(1 + benchmark.growthRate / 100, 3)
    );

    let aiAnalysis = `Based on current Nagpur real estate trends, ${locality} is experiencing steady buyer demand. Properties with ${area} sq.ft and ${bhk} BHK configuration command healthy resale and rental demand, especially with good access to local transit corridors.`;

    // Try Gemini API if key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a certified Nagpur real estate valuation expert.
Evaluate this property in Nagpur:
- Locality: ${locality}
- Configuration: ${bhk} BHK ${propertyType}
- Area: ${area} sq.ft
- Age: ${ageOfProperty}
- Furnishing: ${furnishedStatus}
- Floor: ${floor}
- Key Amenities: ${amenities.join(", ") || "Standard lift, parking"}

Estimated base value: ₹${(estimatedValue / 100000).toFixed(2)} Lakhs (₹${calculatedRatePerSqFt}/sq.ft).

Write a concise 3-paragraph executive appraisal covering:
1. Micro-market dynamics of ${locality}, Nagpur (metro access, landmark proximity, infrastructure).
2. Key value drivers of this specific unit (size, amenities, furnishing).
3. 3-year investment outlook and rental recommendation for Nagpur buyers.
Keep it realistic and professional with accurate Nagpur landmarks.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          aiAnalysis = response.text;
        }
      } catch (geminiError) {
        console.warn("Gemini API call skipped/fallback:", geminiError);
      }
    }

    // Fetch similar active properties in Nagpur for reference
    const similarProperties = await prisma.property.findMany({
      where: {
        locality: { contains: locality },
      },
      take: 3,
      select: {
        id: true,
        title: true,
        price: true,
        locality: true,
        bhk: true,
        areaSqFt: true,
        images: true,
      },
    });

    const parsedSimilar = similarProperties.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
    }));

    return NextResponse.json({
      success: true,
      valuation: {
        locality,
        estimatedValue,
        minValue,
        maxValue,
        ratePerSqFt: calculatedRatePerSqFt,
        monthlyRent,
        annualRentalYield,
        threeYearProjectedValue,
        growthRate: benchmark.growthRate,
        aiAnalysis,
        similarProperties: parsedSimilar,
      },
    });
  } catch (error) {
    console.error("Valuation Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate valuation" },
      { status: 500 }
    );
  }
}
