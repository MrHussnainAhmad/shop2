import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import UserProfile from '../../../../models/UserProfile';

export async function PATCH(request: NextRequest) {
  await dbConnect();
  try {
    const { addressId, email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const userProfile = await UserProfile.findOne({ email });

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Set all addresses for this user to not default
    userProfile.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set the specified address as default
    const defaultAddress = userProfile.addresses.id(addressId);
    if (!defaultAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    defaultAddress.isDefault = true;

    await userProfile.save();

    return NextResponse.json(defaultAddress);
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 });
  }
}