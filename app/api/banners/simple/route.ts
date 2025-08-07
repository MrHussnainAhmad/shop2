import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Banner from "../../../../models/Banner";

export async function GET(request: NextRequest) {
  console.log("=== GET /api/banners/simple START ===");
  
  await dbConnect();
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    console.log(`Found ${banners.length} banners`);
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("=== POST /api/banners/simple START ===");

  try {
    await dbConnect();
    
    const body = await request.json();
    console.log("Creating banner with data:", body);
    
    // Simple validation
    if (!body.title || !body.image) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    const banner = await Banner.create(body);
    console.log("Banner created successfully:", banner._id);
    
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      {
        error: "Failed to create banner",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
