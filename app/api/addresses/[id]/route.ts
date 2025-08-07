import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Address from '../../../../models/Address';
import UserProfile from '../../../../models/UserProfile';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const userProfile = await UserProfile.findOne({ clerkId: userId });
    const address = await Address.findOne({ _id: params.id, user: userProfile._id });
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json(address);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const userProfile = await UserProfile.findOne({ clerkId: userId });
    const address = await Address.findOneAndUpdate(
      { _id: params.id, user: userProfile._id },
      body,
      { new: true }
    );
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json(address);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const userProfile = await UserProfile.findOne({ clerkId: userId });
    const address = await Address.findOneAndDelete({ _id: params.id, user: userProfile._id });
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    userProfile.addresses.pull(address._id);
    await userProfile.save();
    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
