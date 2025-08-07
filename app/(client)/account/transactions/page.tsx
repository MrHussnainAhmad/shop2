"use client";
import React, { useEffect, useState } from "react";
import { fetchOrders, Order } from "@/lib/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Receipt, Calendar, CreditCard, Download, Eye, FileText, ChevronDown, ChevronUp } from "lucide-react";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());

  const toggleTransactionExpansion = (transactionId: string) => {
    const newExpandedTransactions = new Set(expandedTransactions);
    if (newExpandedTransactions.has(transactionId)) {
      newExpandedTransactions.delete(transactionId);
    } else {
      newExpandedTransactions.add(transactionId);
    }
    setExpandedTransactions(newExpandedTransactions);
  };

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        // Only show successful payments as transactions
        const paidOrders = fetchedOrders.filter(order => order.status === 'paid');
        setTransactions(paidOrders);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'canceled':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const generateInvoice = (transaction: Order) => {
    // Create a simple invoice data structure
    const invoiceData = {
      invoiceNumber: `INV-${transaction.paymentIntentId}`,
      date: new Date(transaction.createdAt).toLocaleDateString(),
      customerEmail: transaction.customerEmail,
      items: transaction.items,
      subtotal: transaction.subtotal,
      shipping: transaction.shippingCost,
      total: transaction.totalAmount,
      currency: transaction.currency,
      paymentStatus: transaction.paymentStatus,
      billingAddress: transaction.billingAddress,
      shippingAddress: transaction.shippingAddress,
    };

    // Create and download invoice as JSON (you can modify this to generate PDF)
    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `invoice-${transaction.paymentIntentId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const viewInvoice = (transaction: Order) => {
    // Open invoice in new window for viewing
    const invoiceWindow = window.open('', '_blank');
    if (invoiceWindow) {
      invoiceWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${transaction.paymentIntentId}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
              .invoice-details { margin-bottom: 20px; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items-table th { background-color: #f5f5f5; }
              .total-section { text-align: right; }
              .total-row { font-weight: bold; font-size: 1.2em; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Invoice #${transaction.paymentIntentId}</h1>
              <p>Date: ${new Date(transaction.createdAt).toLocaleDateString()}</p>
              <p>Customer: ${transaction.customerEmail}</p>
            </div>
            
            <div class="invoice-details">
              <h3>Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${transaction.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div class="total-section">
              <p>Subtotal: $${transaction.subtotal.toFixed(2)}</p>
              <p>Shipping: $${transaction.shippingCost.toFixed(2)}</p>
              <p class="total-row">Total: ${transaction.currency.toUpperCase()} $${transaction.totalAmount.toFixed(2)}</p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p><strong>Payment Status:</strong> ${transaction.paymentStatus}</p>
              <p><strong>Transaction ID:</strong> ${transaction.paymentIntentId}</p>
            </div>
          </body>
        </html>
      `);
      invoiceWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <p>Loading your transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No transactions found</h2>
        <p className="text-gray-600 mb-6">
          You don't have any completed transactions yet. Once you make successful purchases, they'll appear here.
        </p>
        <a href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors inline-block">
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          Transaction History & Invoices
        </h2>
        
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction._id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold break-words">
                      Transaction #{transaction.paymentIntentId}
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {transaction.currency.toUpperCase()} ${transaction.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={`${getPaymentStatusColor(transaction.paymentStatus)} text-white text-xs px-2 py-1 whitespace-nowrap`}>
                      {transaction.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Transaction Summary - Always Visible */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Items:</span>
                    <span>{transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{transaction.currency.toUpperCase()} ${transaction.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Collapsible Details */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => toggleTransactionExpansion(transaction._id)}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <span>View Details</span>
                    {expandedTransactions.has(transaction._id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  
                  {expandedTransactions.has(transaction._id) && (
                    <div className="mt-4 space-y-4">
                      {/* Transaction Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Items</p>
                          <p className="font-semibold">{transaction.items.length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="font-semibold">Card Payment</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-semibold text-green-600">Completed</p>
                        </div>
                      </div>
                      
                      {/* Items List */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Purchased Items
                        </h4>
                        <div className="space-y-2">
                          {transaction.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 px-3 bg-white border rounded">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Payment Summary */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${transaction.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>${transaction.shippingCost.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total Paid:</span>
                          <span className="text-green-600">{transaction.currency.toUpperCase()} ${transaction.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewInvoice(transaction)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Invoice
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateInvoice(transaction)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </Button>
                      </div>
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

export default TransactionsPage;
