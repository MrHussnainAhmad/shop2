import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Banner from "../../../../../models/Banner";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("=== GET /api/banners/simple/[id] START ===");
  
  await dbConnect();
  try {
    const banner = await Banner.findById(params.id);
    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("=== PUT /api/banners/simple/[id] START ===");

  try {
    await dbConnect();
    
    const body = await request.json();
    console.log("Updating banner with data:", body);
    
    const banner = await Banner.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("=== DELETE /api/banners/simple/[id] START ===");

  try {
    await dbConnect();
    
    const deletedBanner = await Banner.deleteOne({ _id: params.id });
    if (!deletedBanner.deletedCount) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
