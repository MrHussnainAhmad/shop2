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
    console.log('🔄 Orders API called');
    const { userId } = await auth();
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First try a simple query to test connection
    const simpleQuery = `*[_type == "order"]`;
    const allOrders = await serverClient.fetch(simpleQuery);
    console.log('🗂️ All orders in database:', allOrders.length);
    
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

    console.log('📝 Query:', query);
    console.log('🔍 Fetching orders for user:', userId);
    
    const orders = await serverClient.fetch(query, { userId });
    console.log('📦 Orders found:', orders.length);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
