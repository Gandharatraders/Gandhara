'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#151515] rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-[#292929]" />
            </div>
            <h1 className="text-3xl font-light text-[#F5F5F5] mb-4">
              Your cart is <span className="font-semibold text-[#C7CBD0]">empty</span>
            </h1>
            <p className="text-[#A6A6A6] mb-8">
              Add some watches to your cart to continue shopping.
            </p>
            <Button onClick={() => router.push('/collections/mens-watches')}>
              Browse Collection
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-light text-[#F5F5F5] mb-8">
            Shopping <span className="font-semibold text-[#C7CBD0]">Cart</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedColor}-${item.selectedStrap}`}
                  className="bg-[#101010] rounded-xl p-6 border border-[#292929]"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-[#050505] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images.main}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-[#F5F5F5] font-medium mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-[#A6A6A6] mb-2">SKU: {item.product.sku}</p>
                      
                      {/* Variants */}
                      {(item.selectedColor || item.selectedStrap) && (
                        <div className="flex gap-2 mb-3">
                          {item.selectedColor && (
                            <span className="text-xs text-[#A6A6A6] bg-[#151515] px-2 py-1 rounded">
                              {item.selectedColor}
                            </span>
                          )}
                          {item.selectedStrap && (
                            <span className="text-xs text-[#A6A6A6] bg-[#151515] px-2 py-1 rounded">
                              {item.selectedStrap}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <p className="text-[#F5F5F5] font-semibold">
                        {formatPrice(item.product.salePrice || item.product.price)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center border border-[#292929] rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-[#F5F5F5] min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity}
                          className="px-3 py-1 text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-sm text-[#A6A6A6] hover:text-[#E50920] transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#101010] rounded-xl p-6 border border-[#292929] sticky top-24">
                <h2 className="text-lg font-semibold text-[#F5F5F5] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
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

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-[#A6A6A6] text-center mt-4">
                  Free shipping on orders over PKR 100,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
