'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Clock, Star } from 'lucide-react';

export default function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderNumber) {
      console.log('Looking for order with number:', orderNumber);
      
      // First try localStorage
      const localOrders = JSON.parse(localStorage.getItem('crownix-orders') || '[]');
      console.log('Orders in localStorage:', localOrders);
      const foundOrder = localOrders.find((o: any) => o.orderNumber === orderNumber);
      
      if (foundOrder) {
        console.log('Found order in localStorage:', foundOrder);
        setOrder(foundOrder);
      } else {
        // If not in localStorage, try fetching from API
        console.log('Order not in localStorage, trying API');
        fetch('/api/orders')
          .then(res => res.json())
          .then(orders => {
            console.log('Orders from API:', orders);
            const apiOrder = orders.find((o: any) => o.orderNumber === orderNumber);
            console.log('Found order in API:', apiOrder);
            setOrder(apiOrder);
          })
          .catch(err => {
            console.error('Failed to fetch orders from API:', err);
          });
      }
    }
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#A6A6A6] mb-4">Order not found</p>
        <p className="text-sm text-[#A6A6A6] mb-4">Order Number: {orderNumber || 'Not provided'}</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
          Order <span className="font-semibold text-[#C7CBD0]">Confirmed!</span>
        </h1>
        <p className="text-[#A6A6A6]">
          Thank you for your purchase. Your order has been received.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-[#101010] rounded-xl p-6 border border-[#292929] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-[#A6A6A6] mb-1">Order Number</p>
            <p className="text-xl font-mono text-[#C7CBD0]">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-[#A6A6A6] mb-1">Order Date</p>
            <p className="text-[#F5F5F5]">
              {new Date(order.createdAt).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="flex items-center justify-between mb-8 py-4 border-y border-[#292929]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-xs text-[#A6A6A6]">Confirmed</span>
          </div>
          <div className="flex-1 h-px bg-[#292929] mx-2" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-[#151515] rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-[#A6A6A6]" />
            </div>
            <span className="text-xs text-[#A6A6A6]">Processing</span>
          </div>
          <div className="flex-1 h-px bg-[#292929] mx-2" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-[#151515] rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#A6A6A6]" />
            </div>
            <span className="text-xs text-[#A6A6A6]">Shipped</span>
          </div>
          <div className="flex-1 h-px bg-[#292929] mx-2" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-[#151515] rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#A6A6A6]" />
            </div>
            <span className="text-xs text-[#A6A6A6]">Delivered</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3">Shipping Address</h3>
          <div className="bg-[#151515] rounded-lg p-4">
            <p className="text-[#F5F5F5]">{order.shippingAddress.fullName}</p>
            <p className="text-[#A6A6A6]">{order.shippingAddress.phone}</p>
            <p className="text-[#A6A6A6]">{order.shippingAddress.email}</p>
            <p className="text-[#A6A6A6]">{order.shippingAddress.address}</p>
            <p className="text-[#A6A6A6]">
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#151515] rounded-lg p-4"
              >
                <div className="flex-1">
                  <p className="text-[#F5F5F5] font-medium">{item.productName}</p>
                  <p className="text-sm text-[#A6A6A6]">SKU: {item.sku}</p>
                  <p className="text-sm text-[#A6A6A6]">Qty: {item.quantity}</p>
                  {(item.selectedColor || item.selectedStrap) && (
                    <div className="flex gap-2 mt-1">
                      {item.selectedColor && (
                        <span className="text-xs text-[#A6A6A6]">
                          {item.selectedColor}
                        </span>
                      )}
                      {item.selectedStrap && (
                        <span className="text-xs text-[#A6A6A6]">
                          {item.selectedStrap}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[#F5F5F5] font-semibold">
                  PKR {item.totalPrice.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-[#292929] pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#A6A6A6]">Subtotal</span>
              <span className="text-[#F5F5F5]">PKR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A6A6A6]">Shipping</span>
              <span className="text-[#F5F5F5]">PKR {order.shippingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-[#292929]">
              <span className="text-[#F5F5F5]">Total</span>
              <span className="text-[#F5F5F5]">PKR {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => router.push(`/confirm-order?order=${order.orderNumber}`)} className="bg-[#E50920] hover:bg-[#ff3333]">
          <Star className="w-4 h-4 mr-2" />
          Write a Review
        </Button>
        <Button onClick={() => router.push('/collections/mens-watches')}>
          Continue Shopping
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
