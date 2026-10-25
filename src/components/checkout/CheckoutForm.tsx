'use client';

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: 'Pakistan',
    instructions: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl text-[#F5F5F5] mb-4">Your cart is empty</h1>
        <a href="/collections/mens-watches" className="text-[#E50920] hover:underline">
          Continue Shopping
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate order number
    const newOrderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Create order object
    const order = {
      id: Date.now().toString(),
      orderNumber: newOrderNumber,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.product.salePrice || item.product.price,
        totalPrice: (item.product.salePrice || item.product.price) * item.quantity,
        selectedColor: item.selectedColor,
        selectedStrap: item.selectedStrap,
      })),
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      totalAmount: cart.total,
      status: 'pending' as const,
      shippingAddress: formData,
      paymentMethod: 'cod' as const,
      paymentStatus: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Submitting order:', order);

    try {
      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order API error:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const result = await response.json();
      console.log('Order created successfully:', result);

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      router.push(`/order-confirmation?order=${newOrderNumber}`);
    } catch (error) {
      console.error('Error creating order:', error);
      // Fallback: save to localStorage if API fails
      const existingOrders = JSON.parse(localStorage.getItem('crownix-orders') || '[]');
      localStorage.setItem('crownix-orders', JSON.stringify([order, ...existingOrders]));
      console.log('Order saved to localStorage as fallback. Total orders:', existingOrders.length + 1);
      console.log('Order saved:', order);
      
      clearCart();
      router.push(`/order-confirmation?order=${newOrderNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Checkout Form */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#151515] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Contact Information
            </h2>
            <Input
              label="Full Name"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <Input
              label="Phone Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="bg-[#151515] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Shipping Address
            </h2>
            <Input
              label="Address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="Country"
              disabled
              value={formData.country}
            />
            <Input
              label="Delivery Instructions (Optional)"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div className="bg-[#151515] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-[#292929] rounded-lg cursor-pointer hover:border-[#C7CBD0] transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  defaultChecked
                  className="w-4 h-4"
                />
                <span className="text-[#F5F5F5]">Cash on Delivery</span>
              </label>
              <p className="text-sm text-[#A6A6A6]">
                Pay with cash upon delivery. Available across Pakistan.
              </p>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Place Order - {formatPrice(cart.total)}
          </Button>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-[#151515] rounded-xl p-6 sticky top-24">
          <h2 className="text-lg font-semibold text-[#F5F5F5] mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedColor}-${item.selectedStrap}`}
                className="flex gap-4"
              >
                <div className="w-16 h-16 bg-[#101010] rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images.main}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#F5F5F5] line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-[#F5F5F5]">
                    {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#292929] pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#A6A6A6]">Subtotal</span>
              <span className="text-[#F5F5F5]">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A6A6A6]">Shipping</span>
              <span className="text-[#F5F5F5]">{formatPrice(cart.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-[#292929]">
              <span className="text-[#F5F5F5]">Total</span>
              <span className="text-[#F5F5F5]">{formatPrice(cart.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
