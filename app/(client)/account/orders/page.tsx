"use client";
import React, { useEffect, useState } from "react";
import { fetchOrders, Order } from "@/lib/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Calendar, CreditCard, MapPin, ChevronDown, ChevronUp } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const toggleOrderExpansion = (orderId: string) => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrders(newExpandedOrders);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'canceled':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders found</h2>
        <p className="text-gray-600 mb-6">
          It looks like you haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <a href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors inline-block">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Order History
        </h2>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold break-words">
                      Order #{order.paymentIntentId}
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {order.currency.toUpperCase()} ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={`${getStatusColor(order.status)} text-white text-xs px-2 py-1 whitespace-nowrap`}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Order Summary - Always Visible */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Items:</span>
                    <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{order.currency.toUpperCase()} ${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Collapsible Details */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => toggleOrderExpansion(order._id)}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <span>View Details</span>
                    {expandedOrders.has(order._id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  
                  {expandedOrders.has(order._id) && (
                    <div className="mt-4 space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Order Summary */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>${order.shippingCost.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{order.currency.toUpperCase()} ${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {typeof order.shippingAddress === 'string' ? (
                              <p>{order.shippingAddress}</p>
                            ) : (
                              <div>
                                <p>{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.address?.line1}</p>
                                {order.shippingAddress.address?.line2 && (
                                  <p>{order.shippingAddress.address.line2}</p>
                                )}
                                <p>
                                  {order.shippingAddress.address?.city}, {order.shippingAddress.address?.state} {order.shippingAddress.address?.postal_code}
                                </p>
                                <p>{order.shippingAddress.address?.country}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
