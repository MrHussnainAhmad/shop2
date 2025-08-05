import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { auth } from '@clerk/nextjs/server';

// Create a server-side client with write permissions
const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

/**
 * This endpoint serves as a fallback for localhost development
 * when webhooks are not available. It processes payment success
 * and handles stock reduction manually.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      paymentIntentId, 
      items, 
      subtotal, 
      shippingCost, 
      totalAmount,
      email,
      billingAddress,
      shippingAddress 
    } = body;

    if (!paymentIntentId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }


    // Check if order already exists
    const existingOrderQuery = `*[_type == "order" && paymentIntentId == $paymentIntentId][0]`;
    const existingOrder = await serverClient.fetch(existingOrderQuery, { paymentIntentId });
    
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderId: existingOrder._id,
        message: 'Order already exists'
      });
    }

    // Create order in Sanity
    const order = {
      _type: 'order',
      paymentIntentId,
      userId,
      items: items.map((item: any) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.originalPrice || 0,
        quantity: item.quantity
      })),
      subtotal: subtotal || 0,
      shippingCost: shippingCost || 0,
      totalAmount: totalAmount || 0,
      currency: 'USD',
      status: 'paid',
      paymentStatus: 'succeeded',
      customerEmail: email,
      billingAddress,
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };


    // Save order to Sanity
    const result = await serverClient.create(order);

    // Reduce stock for each purchased item
    await reduceProductStockFromCart(items);

    return NextResponse.json({
      success: true,
      orderId: result._id,
      message: 'Order processed and stock reduced successfully'
    });

  } catch (error) {
    console.error('❌ Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

/**
 * Reduces stock for items coming from the cart structure
 * (different from webhook items structure)
 */
async function reduceProductStockFromCart(cartItems: any[]) {
  
  for (const cartItem of cartItems) {
    try {
      const productId = cartItem.product._id;
      const quantity = cartItem.quantity;
      const name = cartItem.product.name;
      
      if (!productId || !quantity || quantity <= 0) {
        continue;
      }

      // First, get the current product data
      const productQuery = `*[_type == "product" && _id == $productId][0]{ _id, name, stock, status }`;
      const product = await serverClient.fetch(productQuery, { productId });
      
      if (!product) {
        continue;
      }

      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - quantity);
      

      // Update the product stock
      const updateData: any = {
        stock: newStock,
      };

      // If stock reaches 0, update status to "Out of Stock"
      if (newStock === 0) {
        updateData.status = 'Out of Stock';
      }

      // Perform the update
      await serverClient
        .patch(productId)
        .set(updateData)
        .commit();

      
    } catch (error) {
      // Continue with other items even if one fails
    }
  }
  
}
