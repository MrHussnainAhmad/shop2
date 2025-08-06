import { NextRequest, NextResponse } from 'next/server';
import { stripe, verifyStripeSignature } from '@/lib/stripe';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const isLocalhost = process.env.NODE_ENV === 'development' && !webhookSecret?.startsWith('whsec_');

    // Handle localhost development without webhook secret
    if (isLocalhost) {
      let event;
      try {
        event = JSON.parse(body);
      } catch (err) {
        return NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        );
      }
      
      await handleWebhookEvent(event);
      return NextResponse.json({ received: true });
    }

    // Production mode - require signature verification
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event;
    try {
      event = verifyStripeSignature(body, signature);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    await handleWebhookEvent(event);
    return NextResponse.json({ received: true });

  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Extracted event handling logic
async function handleWebhookEvent(event: any) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    
    case 'payment_intent.canceled':
      await handlePaymentCanceled(event.data.object);
      break;
    
    default:
      // Unhandled event type
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  await dbConnect();
  try {
    
    const {
      id,
      amount,
      currency,
      metadata,
      receipt_email,
      created
    } = paymentIntent;


    // Check if order already exists to prevent duplicates
    const existingOrder = await Order.findOne({ paymentIntentId: id });
    
    if (existingOrder) {
      return existingOrder;
    }

    // Parse metadata with error handling
    const userId = metadata.userId;
    if (!userId) {
      throw new Error('Missing userId in payment intent metadata');
    }

    let items = [];
    try {
      items = JSON.parse(metadata.items || '[]');
    } catch (e) {
      items = [];
    }

    const subtotal = parseFloat(metadata.subtotal || '0');
    const shippingCost = parseFloat(metadata.shippingCost || '0');
    
    let billingAddress = null;
    let shippingAddress = null;
    
    try {
      billingAddress = metadata.billingAddress ? JSON.parse(metadata.billingAddress) : null;
    } catch (e) {
      // Silent fail for address parsing
    }
    
    try {
      shippingAddress = metadata.shippingAddress ? JSON.parse(metadata.shippingAddress) : null;
    } catch (e) {
      // Silent fail for address parsing
    }

    // Create order in MongoDB
    const order = {
      paymentIntentId: id,
      userId,
      items: items.map((item: any) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      shippingCost,
      totalAmount: amount / 100, // Convert from cents
      currency: currency.toUpperCase(),
      status: 'paid',
      paymentStatus: 'succeeded',
      customerEmail: receipt_email,
      billingAddress,
      shippingAddress,
      createdAt: new Date(created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };


    // Save order to MongoDB
    const result = await Order.create(order);

    // Reduce stock for each purchased item
    await reduceProductStock(items);

    return result;

  } catch (error) {
    console.error('❌ Error handling payment success:', error);
    console.error('Payment Intent ID:', paymentIntent.id);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  await dbConnect();
  try {
    const { id, metadata } = paymentIntent;
    const userId = metadata.userId;

    // Payment failed - could be logged to monitoring service

    // Optionally create a failed order record
    const failedOrder = {
      paymentIntentId: id,
      userId,
      status: 'failed',
      paymentStatus: 'failed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await Order.create(failedOrder);

  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  await dbConnect();
  try {
    const { id, metadata } = paymentIntent;
    const userId = metadata.userId;

    // Payment canceled - could be logged to monitoring service

    // Optionally create a canceled order record
    const canceledOrder = {
      paymentIntentId: id,
      userId,
      status: 'canceled',
      paymentStatus: 'canceled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await Order.create(canceledOrder);

  } catch (error) {
    console.error('Error handling payment cancellation:', error);
    throw error;
  }
}

/**
 * Reduces stock quantity for purchased products in MongoDB
 * @param {Array} items - Array of purchased items with productId and quantity
 */
async function reduceProductStock(items: any[]) {
  await dbConnect();
  for (const item of items) {
    try {
      const productId = item.id;
      const { quantity } = item;
      
      if (!productId || !quantity || quantity <= 0) {
        continue;
      }

      // First, get the current product data
      const product = await Product.findById(productId);
      
      if (!product) {
        continue;
      }

      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - quantity); // Ensure stock doesn't go below 0
      

      // Update the product stock
      const updateData: any = {
        stock: newStock,
      };

      // If stock reaches 0, update status to "Out of Stock"
      if (newStock === 0) {
        updateData.status = 'Out of Stock';
      }

      // Perform the update
      await Product.findByIdAndUpdate(productId, updateData);

      
    } catch (error) {
      // Continue with other items even if one fails
    }
  }
  
}