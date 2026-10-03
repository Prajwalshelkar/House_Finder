import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        dealer: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    const parsedProperty = {
      ...property,
      amenities: JSON.parse(property.amenities || "[]"),
      images: JSON.parse(property.images || "[]"),
    };

    return NextResponse.json({
      success: true,
      property: parsedProperty,
    });
  } catch (error) {
    console.error("Error fetching property detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch property detail" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if property exists first (idempotent delete)
    const existing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({
        success: true,
        message: "Property already deleted or not found",
      });
    }

    // Delete any dependent inquiries first to maintain relational integrity
    await prisma.inquiry.deleteMany({
      where: { propertyId: id },
    });

    // Delete the property
    const deleted = await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
      deletedId: deleted.id,
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
