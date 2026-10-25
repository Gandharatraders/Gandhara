'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Cart Button in Header would trigger this */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors"
        aria-label="Open cart"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cart.items.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E50920] text-white text-xs rounded-full flex items-center justify-center">
            {cart.items.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#050505] z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#292929]">
                <h2 className="text-xl font-semibold text-[#F5F5F5]">Shopping Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#A6A6A6] mb-4">Your cart is empty</p>
                    <Link href="/collections/mens-watches">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-[#E50920] hover:underline"
                      >
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={`${item.productId}-${item.selectedColor}-${item.selectedStrap}`}
                        className="flex gap-4 pb-4 border-b border-[#292929]"
                      >
                        {/* Product Image */}
                        <div className="relative w-24 h-24 bg-[#101010] rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images.main}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-2">
                          <h3 className="text-sm font-medium text-[#F5F5F5] line-clamp-1">
                            {item.product.name}
                          </h3>
                          {item.selectedColor && (
                            <p className="text-xs text-[#A6A6A6]">
                              Color: {item.selectedColor}
                            </p>
                          )}
                          {item.selectedStrap && (
                            <p className="text-xs text-[#A6A6A6]">
                              Strap: {item.selectedStrap}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-[#F5F5F5]">
                            {formatPrice(item.product.salePrice || item.product.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-[#292929] rounded text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm text-[#F5F5F5]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-[#292929] rounded text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="ml-auto p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.items.length > 0 && (
                <div className="border-t border-[#292929] p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A6A6A6]">Subtotal</span>
                    <span className="text-[#F5F5F5]">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A6A6A6]">Shipping</span>
                    <span className="text-[#F5F5F5]">{formatPrice(cart.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-[#F5F5F5]">Total</span>
                    <span className="text-[#F5F5F5]">{formatPrice(cart.total)}</span>
                  </div>
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-3 bg-[#E50920] text-white rounded-lg font-medium hover:bg-[#c4081a] transition-colors">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
