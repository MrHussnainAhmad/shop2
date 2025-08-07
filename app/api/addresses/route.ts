import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Address from '../../../models/Address';
import UserProfile from '../../../models/UserProfile';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  await dbConnect();
  try {
    const userProfile = await UserProfile.findOne({ email });
    if (!userProfile) {
      console.error(`User profile not found for email: ${email}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const addresses = await Address.find({ user: userProfile._id });
    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const { user } = auth();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    let userProfile = await UserProfile.findOne({ clerkId: userId });

    if (!userProfile) {
      userProfile = await UserProfile.create({
        clerkId: userId,
        email: email,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      });
    }

    const address = await Address.create({ ...body, user: userProfile._id });
    userProfile.addresses.push(address._id);
    await userProfile.save();
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
