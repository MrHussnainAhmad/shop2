import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import UserProfile from '../../../../models/UserProfile';


export async function GET(request: NextRequest, { params }: { params: { addressId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { addressId } = params;
  await dbConnect();
  try {
    const userProfile = await UserProfile.findOne({ clerkId: userId });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const address = userProfile.addresses.id(addressId);
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { addressId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { addressId } = params;
  await dbConnect();
  try {
    const body = await request.json();
    const userProfile = await UserProfile.findOne({ clerkId: userId });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const address = userProfile.addresses.id(addressId);
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If setting this address as default, unset all other addresses as default first
    if (body.isDefault === true) {
      userProfile.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Update the address fields
    Object.assign(address, body);

    await userProfile.save();
    return NextResponse.json(address);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { addressId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { addressId } = params;
  await dbConnect();
  try {
    const userProfile = await UserProfile.findOne({ clerkId: userId });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    userProfile.addresses.id(addressId).deleteOne();
    await userProfile.save();

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
