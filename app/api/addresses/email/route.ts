import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import UserProfile from "../../../../models/UserProfile";

export async function GET(request: NextRequest) {
  console.log("=== GET /api/addresses/email START ===");
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  
  if (!email) {
    console.log("No email provided");
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  console.log("Looking for addresses for email:", email);

  await dbConnect();
  try {
    // Find user by email
    let userProfile = await UserProfile.findOne({ email: email });
    
    if (!userProfile) {
      console.log("User not found, returning empty addresses");
      return NextResponse.json([]);
    }
    
    console.log("Found user profile:", {
      _id: userProfile._id,
      email: userProfile.email,
      addressesCount: userProfile.addresses?.length || 0,
    });
    
    const addresses = userProfile.addresses || [];
    console.log("=== GET /api/addresses/email SUCCESS ===");
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("=== GET /api/addresses/email ERROR ===");
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("=== POST /api/addresses/email START ===");

  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully");

    console.log("Parsing request body...");
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { email, ...addressData } = body;
    
    if (!email) {
      console.error("Email not provided in request body");
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("Looking for user with email:", email);

    // Try to find user by email
    let userProfile = await UserProfile.findOne({ email: email });

    // Create new user if not found
    if (!userProfile) {
      console.log("=== CREATING NEW USER ===");
      const newUserData = {
        clerkId: `email_${Date.now()}`, // Generate a unique clerkId for email users
        email: email,
        firstName: addressData.name?.split(' ')[0] || "",
        lastName: addressData.name?.split(' ').slice(1).join(' ') || "",
        addresses: [], // Initialize empty addresses array
      };
      console.log("Creating user with data:", newUserData);

      userProfile = await UserProfile.create(newUserData);
      console.log("Created new userProfile:", {
        _id: userProfile._id,
        email: userProfile.email,
        clerkId: userProfile.clerkId,
      });
    }

    console.log("=== ADDING ADDRESS ===");
    console.log("Current user before adding address:", {
      _id: userProfile._id,
      email: userProfile.email,
      addressesCount: userProfile.addresses?.length || 0,
    });

    // Prepare the new address (ensure email is included)
    const newAddress = { 
      ...addressData,
      email: email // Ensure email is always in the address
    };
    delete newAddress._id; // Ensure Mongoose generates a new _id for subdocument
    console.log("New address to add:", JSON.stringify(newAddress, null, 2));

    // Initialize addresses array if it doesn't exist
    if (!userProfile.addresses) {
      console.log("Initializing addresses array");
      userProfile.addresses = [];
    }

    console.log("Addresses count before push:", userProfile.addresses.length);

    // Add the new address
    userProfile.addresses.push(newAddress);
    console.log("Addresses count after push:", userProfile.addresses.length);

    // Save the user profile
    console.log("Saving user profile...");
    const savedProfile = await userProfile.save();
    console.log("User profile saved successfully");
    console.log("Final addresses count:", savedProfile.addresses.length);

    // Return the newly created address with its generated _id
    const createdAddress = savedProfile.addresses[savedProfile.addresses.length - 1];
    console.log("Created address to return:", JSON.stringify(createdAddress, null, 2));

    console.log("=== POST /api/addresses/email SUCCESS ===");
    return NextResponse.json(createdAddress, { status: 201 });
  } catch (error) {
    console.error("=== POST /api/addresses/email ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // If it's a validation error, log validation details
    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
    }

    // If it's a MongoDB error, log more details
    if (error.code) {
      console.error("MongoDB error code:", error.code);
    }

    return NextResponse.json(
      {
        error: "Failed to create address",
        details: error.message,
        type: error.name,
      },
      { status: 500 }
    );
  }
}
