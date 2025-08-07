import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WebData from '@/models/WebData';

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    let webData = await WebData.findOne({});

    if (!webData) {
      // If no web data exists, create a default one
      webData = await WebData.create({
        aboutUs: 'Default About Us content.',
        terms: 'Default Terms and Conditions content.',
        privacy: 'Default Privacy Policy content.',
        faqs: 'Default FAQs content.',
        help: 'Default Help content.',
        socialLinks: {},
        contactInfo: {},
        logo: '/Logo.png',
        storeName: 'My Awesome Store',
      });
    }

    return NextResponse.json({ data: webData });
  } catch (error) {
    console.error('Error fetching web data:', error);
    return NextResponse.json({ error: 'Failed to fetch web data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    let webData;
    if (_id) {
      // If _id is provided, try to update existing document
      webData = await WebData.findByIdAndUpdate(_id, updateData, { new: true });
    } else {
      // Otherwise, create a new document (or update the first one found)
      webData = await WebData.findOneAndUpdate({}, updateData, { new: true, upsert: true });
    }

    return NextResponse.json({ data: webData });
  } catch (error) {
    console.error('Error updating web data:', error);
    return NextResponse.json({ error: 'Failed to update web data' }, { status: 500 });
  }
}
