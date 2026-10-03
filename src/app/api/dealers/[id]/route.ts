import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dealer = await prisma.dealer.findUnique({
      where: { id },
      include: {
        properties: {
          orderBy: { createdAt: "desc" },
        },
        inquiries: {
          orderBy: { createdAt: "desc" },
          include: {
            property: true,
          },
        },
      },
    });

    if (!dealer) {
      return NextResponse.json(
        { success: false, error: "Dealer not found" },
        { status: 404 }
      );
    }

    const parsedProperties = dealer.properties.map((p) => ({
      ...p,
      amenities: JSON.parse(p.amenities || "[]"),
      images: JSON.parse(p.images || "[]"),
    }));

    return NextResponse.json({
      success: true,
      dealer: {
        ...dealer,
        properties: parsedProperties,
      },
    });
  } catch (error) {
    console.error("Error fetching dealer profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dealer profile" },
      { status: 500 }
    );
  }
}
