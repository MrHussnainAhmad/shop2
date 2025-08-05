import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from 'next-sanity';

// Create a client with write token for server-side operations
const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `*[_type == "userProfile" && userId == $userId][0]`;
    const profile = await serverClient.fetch(query, { userId });
    
    return NextResponse.json(profile || null);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phoneNumber } = body;

    // Check if profile already exists
    const existingQuery = `*[_type == "userProfile" && userId == $userId][0]`;
    const existingProfile = await serverClient.fetch(existingQuery, { userId });

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await serverClient
        .patch(existingProfile._id)
        .set({
          firstName,
          lastName,
          phoneNumber,
          updatedAt: new Date().toISOString(),
        })
        .commit();
      
      return NextResponse.json(updatedProfile);
    } else {
      // Create new profile
      const newProfile = await serverClient.create({
        _type: 'userProfile',
        userId,
        firstName,
        lastName,
        phoneNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      return NextResponse.json(newProfile);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
