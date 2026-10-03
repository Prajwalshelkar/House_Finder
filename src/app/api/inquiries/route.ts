import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get("dealerId");
    const status = searchParams.get("status");

    const where: any = {};
    if (dealerId && dealerId !== "all") where.dealerId = dealerId;
    if (status && status !== "all") where.status = status;

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            locality: true,
            bhk: true,
            images: true,
          },
        },
        dealer: {
          select: {
            id: true,
            name: true,
            agencyName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, dealerId, buyerName, buyerPhone, buyerEmail, message } = body;

    if (!propertyId || !dealerId || !buyerName || !buyerPhone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (propertyId, dealerId, buyerName, buyerPhone)" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        dealerId,
        buyerName,
        buyerPhone,
        buyerEmail: buyerEmail || "",
        message: message || "Interested in scheduling a site visit.",
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { inquiryId, status } = body;

    if (!inquiryId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing inquiryId or status" },
        { status: 400 }
      );
    }

    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      inquiry: updated,
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
