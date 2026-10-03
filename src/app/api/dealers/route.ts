import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      orderBy: { rating: "desc" },
      include: {
        _count: {
          select: {
            properties: true,
            inquiries: true,
          },
        },
      },
    });

    const parsed = dealers.map((d) => ({
      ...d,
      propertiesCount: d._count.properties,
      inquiriesCount: d._count.inquiries,
    }));

    return NextResponse.json({
      success: true,
      dealers: parsed,
    });
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dealers" },
      { status: 500 }
    );
  }
}
