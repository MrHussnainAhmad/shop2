import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Address from '../../../../models/Address';

export async function GET(request: NextRequest, { params }: { params: { addressId: string } }) {
  const { addressId } = params;
  await dbConnect();
  try {
    const address = await Address.findById(addressId);
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
    const updatedAddress = await Address.findByIdAndUpdate(addressId, body, { new: true });
    if (!updatedAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json(updatedAddress);
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
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
