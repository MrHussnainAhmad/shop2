import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@sanity/client';

// Log environment variables (without exposing the token)
console.log('Sanity config:', {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  hasToken: !!process.env.SANITY_TOKEN,
  tokenLength: process.env.SANITY_TOKEN?.length || 0
});

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2025-08-02',
  token: process.env.SANITY_TOKEN,
});

// GET - Fetch addresses for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('No userId found in auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user email from search params or we'll need to get it from Clerk
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      console.error('No email parameter provided');
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    console.log('Fetching addresses for email:', email);
    const query = `*[_type == "address" && email == "${email}"] | order(_createdAt desc)`;
    const addresses = await sanityClient.fetch(query);
    console.log('Found addresses:', addresses.length);

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('No userId found in auth for POST');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST body:', body);
    
    // If this is set as default, update other addresses first
    if (body.isDefault) {
      const otherAddresses = await sanityClient.fetch(
        `*[_type == "address" && email == "${body.email}"]`
      );
      
      for (const addr of otherAddresses) {
        await sanityClient.patch(addr._id).set({ isDefault: false }).commit();
      }
    }

    console.log('Creating address with data:', body);
    const result = await sanityClient.create({
      _type: 'address',
      ...body,
    });
    console.log('Address created:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ 
      error: 'Failed to create address', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// PUT - Update address
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    // If this is set as default, update other addresses first
    if (updateData.isDefault) {
      const otherAddresses = await sanityClient.fetch(
        `*[_type == "address" && email == "${updateData.email}" && _id != "${_id}"]`
      );
      
      for (const addr of otherAddresses) {
        await sanityClient.patch(addr._id).set({ isDefault: false }).commit();
      }
    }

    const result = await sanityClient.patch(_id).set(updateData).commit();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { addressId } = body;

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    await sanityClient.delete(addressId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
