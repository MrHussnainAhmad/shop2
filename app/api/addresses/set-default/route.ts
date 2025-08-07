import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Address from '../../../models/Address';
import UserProfile from '../../../models/UserProfile';

export async function PATCH(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { addressId, email } = await request.json();

    if (!addressId || !email) {
      return NextResponse.json({ error: 'Address ID and email are required' }, { status: 400 });
    }

    const userProfile = await UserProfile.findOne({ email });

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Set all addresses for this user to not default
    await Address.updateMany({ user: userProfile._id }, { isDefault: false });

    // Set the specified address as default
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );

    if (!updatedAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 });
  }
}