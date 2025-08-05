import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from 'next-sanity';

// Create a server-side client with write permissions
const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      items,
      billingAddress,
      shippingAddress,
      paymentIntentId,
      subtotal,
      shippingCost,
      email,
      totalAmount
    } = body;

    if (!paymentIntentId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if order already exists to prevent duplicates
    const existingOrderQuery = `*[_type == "order" && paymentIntentId == $paymentIntentId][0]`;
    const existingOrder = await serverClient.fetch(existingOrderQuery, { paymentIntentId });

    if (existingOrder) {
      console.log('Order already exists:', existingOrder._id);
      return NextResponse.json({ 
        success: true, 
        orderId: existingOrder._id,
        message: 'Order already exists'
      });
    }

    // Calculate total if not provided
    const calculatedTotal = totalAmount || (subtotal + shippingCost);

    // Create order in Sanity
    const order = {
      _type: 'order',
      paymentIntentId,
      userId,
      items: items.map((item: any) => ({
        productId: item.product?._id || item.id,
        name: item.product?.name || item.name,
        price: item.product?.originalPrice || item.price,
        quantity: item.quantity
      })),
      subtotal: subtotal || 0,
      shippingCost: shippingCost || 0,
      totalAmount: calculatedTotal,
      currency: 'USD',
      status: 'paid',
      paymentStatus: 'succeeded',
      customerEmail: email,
      billingAddress,
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating order:', order);
    const result = await serverClient.create(order);
    console.log('Order created successfully:', result._id);

    return NextResponse.json({ 
      success: true, 
      orderId: result._id,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
