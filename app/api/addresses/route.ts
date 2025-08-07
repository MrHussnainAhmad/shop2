import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import UserProfile from "../../../models/UserProfile";

export async function GET(request: NextRequest) {
  console.log("=== GET /api/addresses START ===");
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get("clerkId");
  
  let authResult;
  try {
    authResult = auth();
    console.log("Auth result:", { userId: authResult?.userId, hasUser: !!authResult?.user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
  
  const { userId, user } = authResult || {};

  console.log("URL clerkId parameter:", clerkId);
  console.log("Auth userId:", userId);

  if (!userId) {
    console.log("No userId from auth");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    console.log("=== SEARCHING FOR USER ===");
    console.log("Looking for user with clerkId:", userId);
    
    // Try to find user by clerkId first (use userId from auth, not URL param)
    let userProfile = await UserProfile.findOne({ clerkId: userId });
    console.log("Query result for clerkId:", userProfile ? "FOUND" : "NOT FOUND");
    
    // If not found by clerkId, try by email as fallback
    if (!userProfile) {
      const email = user?.emailAddresses?.[0]?.emailAddress;
      if (email) {
        console.log("User not found by clerkId, trying by email:", email);
        userProfile = await UserProfile.findOne({ email: email });
        console.log("Query result for email:", userProfile ? "FOUND" : "NOT FOUND");
        
        // If found by email, update the clerkId
        if (userProfile && !userProfile.clerkId) {
          console.log("Updating user with clerkId...");
          userProfile.clerkId = userId;
          await userProfile.save();
          console.log("Updated user with clerkId successfully");
        }
      }
    }
    
    if (!userProfile) {
      console.error(`User profile not found for clerkId: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("Found user profile:", {
      _id: userProfile._id,
      email: userProfile.email,
      clerkId: userProfile.clerkId,
      addressesCount: userProfile.addresses?.length || 0,
    });
    
    const addresses = userProfile.addresses || [];
    console.log("=== GET /api/addresses SUCCESS ===");
    return NextResponse.json(addresses);
  } catch (error) {
    console.error("=== GET /api/addresses ERROR ===");
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("=== POST /api/addresses START ===");

  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully");

    // Try both auth approaches
    console.log("Getting auth info...");
    let userId;
    let user;
    
    // First try auth()
    try {
      const authResult = auth();
      console.log("Auth() result:", { 
        userId: authResult?.userId, 
        hasUser: !!authResult?.user
      });
      userId = authResult?.userId;
      user = authResult?.user;
    } catch (error) {
      console.error("Auth() error:", error);
    }
    
    // If auth() didn't work, try currentUser()
    if (!userId) {
      try {
        console.log("Trying currentUser() approach...");
        const currentUserResult = await currentUser();
        console.log("CurrentUser() result:", { 
          id: currentUserResult?.id, 
          hasEmailAddresses: !!currentUserResult?.emailAddresses?.length 
        });
        userId = currentUserResult?.id;
        user = currentUserResult;
      } catch (error) {
        console.error("CurrentUser() error:", error);
      }
    }

    if (!userId) {
      console.log("No userId found in auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Auth userId:", userId);
    console.log("Auth user email addresses:", user?.emailAddresses);
    console.log("Auth user firstName:", user?.firstName);
    console.log("Auth user lastName:", user?.lastName);

    console.log("Parsing request body...");
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const email = user?.emailAddresses?.[0]?.emailAddress;
    console.log("Extracted email:", email);

    if (!email) {
      console.error("User email not found in auth");
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    console.log("=== SEARCHING FOR USER ===");
    console.log("Looking for user with clerkId:", userId);

    // Try to find user by clerkId first
    let userProfile = await UserProfile.findOne({ clerkId: userId });
    console.log(
      "Query result for clerkId:",
      userProfile ? "FOUND" : "NOT FOUND"
    );

    if (userProfile) {
      console.log("Found user by clerkId:", {
        _id: userProfile._id,
        email: userProfile.email,
        clerkId: userProfile.clerkId,
        addressesCount: userProfile.addresses?.length || 0,
      });
    }

    // If not found by clerkId, try by email (your suggested fallback)
    if (!userProfile) {
      console.log("User not found by clerkId, trying by email:", email);
      userProfile = await UserProfile.findOne({ email: email });
      console.log(
        "Query result for email:",
        userProfile ? "FOUND" : "NOT FOUND"
      );

      if (userProfile) {
        console.log("Found user by email:", {
          _id: userProfile._id,
          email: userProfile.email,
          clerkId: userProfile.clerkId,
          addressesCount: userProfile.addresses?.length || 0,
        });

        // If found by email, update the clerkId
        if (!userProfile.clerkId) {
          console.log("Updating user with clerkId...");
          userProfile.clerkId = userId;
          const updatedUser = await userProfile.save();
          console.log("Updated user with clerkId successfully");
        }
      }
    }

    // Create new user if still not found
    if (!userProfile) {
      console.log("=== CREATING NEW USER ===");
      const newUserData = {
        clerkId: userId,
        email: email,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
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
      clerkId: userProfile.clerkId,
      addressesCount: userProfile.addresses?.length || 0,
    });

    // Prepare the new address
    const newAddress = { ...body };
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
    console.log(
      "Address added to array:",
      JSON.stringify(
        userProfile.addresses[userProfile.addresses.length - 1],
        null,
        2
      )
    );

    // Save the user profile
    console.log("Saving user profile...");
    const savedProfile = await userProfile.save();
    console.log("User profile saved successfully");
    console.log("Final addresses count:", savedProfile.addresses.length);

    // Return the newly created address with its generated _id
    const createdAddress =
      savedProfile.addresses[savedProfile.addresses.length - 1];
    console.log(
      "Created address to return:",
      JSON.stringify(createdAddress, null, 2)
    );

    console.log("=== POST /api/addresses SUCCESS ===");
    return NextResponse.json(createdAddress, { status: 201 });
  } catch (error) {
    console.error("=== POST /api/addresses ERROR ===");
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
