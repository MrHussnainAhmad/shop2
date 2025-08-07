"use client";
import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import useCartStore from '@/store';
import { formatPrice } from '@/lib/stripe';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  clientSecret: string;
  paymentIntentId: string;
}

export default function CheckoutForm({ clientSecret, paymentIntentId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState<Record<string, any> | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Record<string, any> | null>(null);
  
  const shippingCost = 10; // You can make this dynamic
  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !isReady) {
      toast.error('Payment system is not ready. Please try again.');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?payment_intent=${paymentIntentId}`,
          receipt_email: email,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast.error(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        
        // Fallback order creation and stock reduction - especially for localhost
        try {
          await fetch('/api/orders/process-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items,
              billingAddress,
              shippingAddress,
              paymentIntentId: paymentIntent.id,
              subtotal: totalPrice,
              shippingCost,
              email,
              totalAmount: finalTotal
            }),
          });
        } catch (orderError) {
          // Don't show error to user as payment was successful
        }
        
        clearCart();
        
        // Redirect to success page
        window.location.href = `/checkout/success?payment_intent=${paymentIntent.id}`;
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading payment form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${((item.product.originalPrice || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressElement
                  options={{
                    mode: 'shipping',
                    allowedCountries: ['US', 'CA'],
                  }}
                  onChange={(event) => {
                    if (event.complete) {
                      setShippingAddress(event.value);
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressElement
                  options={{
                    mode: 'billing',
                    allowedCountries: ['US', 'CA'],
                  }}
                  onChange={(event) => {
                    if (event.complete) {
                      setBillingAddress(event.value);
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentElement
                  options={{
                    layout: 'tabs',
                    paymentMethodOrder: ['card', 'apple_pay', 'google_pay']
                  }}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!stripe || !elements || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(finalTotal * 100)}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
