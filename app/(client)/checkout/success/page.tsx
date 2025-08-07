"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, User, Mail, MapPin } from "lucide-react";

interface Order {
  _id: string;
  paymentIntentId: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: any;
  createdAt: string;
}

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!paymentIntentId) {
        setLoading(false);
        return;
      }

      try {
        // Wait a moment for order to be created
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch('/api/orders');
        if (response.ok) {
          const orders = await response.json();
          const foundOrder = orders.find((o: Order) => o.paymentIntentId === paymentIntentId);
          setOrder(foundOrder || null);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [paymentIntentId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>

          {/* Payment Intent ID */}
          {paymentIntentId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Payment ID:</strong> {paymentIntentId}
              </p>
            </div>
          )}

          {/* Order Details */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading order details...</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700">Order ID</p>
                    <p className="text-gray-900">{order._id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700">Total Amount</p>
                    <p className="text-gray-900 font-semibold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Items Ordered</h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                {order.customerEmail && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">Confirmation Email</p>
                    </div>
                    <p className="text-blue-800">A confirmation email has been sent to {order.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Order details will be available shortly.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <a 
              href="/account/orders" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-center font-medium"
            >
              View All Orders
            </a>
            <a 
              href="/" 
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors text-center font-medium"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

