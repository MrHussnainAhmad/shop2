import { NextRequest, NextResponse } from 'next/server';
import { stripe, toCents } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

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
    const { items, shipping, billingAddress, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const subtotal = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);

    const shippingCost = shipping?.cost || 0;
    const totalAmount = subtotal + shippingCost;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(totalAmount),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        itemCount: items.length.toString(),
        subtotal: subtotal.toString(),
        shippingCost: shippingCost.toString(),
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))),
        ...(billingAddress && {
          billingAddress: JSON.stringify(billingAddress)
        }),
        ...(shippingAddress && {
          shippingAddress: JSON.stringify(shippingAddress)
        })
      },
      receipt_email: body.email || undefined,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
