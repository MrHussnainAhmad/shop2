"use client";
import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import useCartStore from '@/store';
import { useUser } from '@clerk/nextjs';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const stripePromise = getStripe();

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const { user, isLoaded } = useUser();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = 10;
  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    if (isLoaded && !user) {
      // Redirect to sign-in if not authenticated
      window.location.href = '/sign-in?redirect_url=/checkout';
      return;
    }

    if (items.length === 0 || finalTotal <= 0) {
      return;
    }

    createPaymentIntent();
  }, [isLoaded, user, items.length, finalTotal]);

  const createPaymentIntent = async () => {
    if (!user || items.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.originalPrice || 0,
            quantity: item.quantity
          })),
          shipping: {
            cost: shippingCost
          },
          email: user.emailAddresses[0]?.emailAddress
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (err) {
      console.error('Error creating payment intent:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Preparing checkout...</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <ShoppingCart className="h-24 w-24 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link href="/shop">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !clientSecret) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Payment Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={createPaymentIntent} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  'Try Again'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show checkout form when everything is ready
  if (clientSecret && paymentIntentId) {
    const options = {
      clientSecret,
      appearance: {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#0f172a',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          fontFamily: 'system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '6px',
        }
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600">Complete your order securely</p>
          </div>
          
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm 
              clientSecret={clientSecret} 
              paymentIntentId={paymentIntentId}
            />
          </Elements>
        </div>
      </div>
    );
  }

  return null;
}
