import { client } from '@/sanity/lib/client';

export interface Order {
  _id: string;
  paymentIntentId: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  status: 'paid' | 'failed' | 'canceled';
  paymentStatus: 'succeeded' | 'failed' | 'canceled';
  customerEmail: string;
  billingAddress?: any;
  shippingAddress?: any;
  createdAt: string;
  updatedAt: string;
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await fetch('/api/orders');
    if (response.ok) {
      const orders = await response.json();
      return orders;
    } else {
      console.error('Failed to fetch orders:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    if (response.ok) {
      const order = await response.json();
      return order;
    } else {
      console.error('Failed to fetch order:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const query = `*[_type == "order"] | order(createdAt desc) {
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

    const orders = await client.fetch(query);
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string, paymentStatus: string): Promise<boolean> {
  try {
    await client
      .patch(orderId)
      .set({
        status,
        paymentStatus,
        updatedAt: new Date().toISOString(),
      })
      .commit();
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}
