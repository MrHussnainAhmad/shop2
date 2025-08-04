import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2025-08-02',
  token: process.env.SANITY_TOKEN,
});

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('No userId found in auth for PATCH');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { addressId, email } = body;

    if (!addressId || !email) {
      return NextResponse.json({ error: 'Address ID and email required' }, { status: 400 });
    }

    // Set all addresses to non-default
    const allAddresses = await sanityClient.fetch(
      `*[_type == "address" && email == "${email}"]`
    );
    
    for (const addr of allAddresses) {
      await sanityClient.patch(addr._id).set({ isDefault: false }).commit();
    }
    
    // Set selected address as default
    const result = await sanityClient.patch(addressId).set({ isDefault: true }).commit();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 });
  }
}
