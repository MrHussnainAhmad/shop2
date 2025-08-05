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

    const query = `*[_type == "order" && userId == $userId] | order(createdAt desc) {
      _id,
      paymentIntentId,
      userId,
      items,
      subtotal,
      shippingCost,
      totalAmount,
      currency,
      status,
      paymentStatus,
      customerEmail,
      billingAddress,
      shippingAddress,
      createdAt,
      updatedAt
    }`;
    
    const orders = await serverClient.fetch(query, { userId });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
